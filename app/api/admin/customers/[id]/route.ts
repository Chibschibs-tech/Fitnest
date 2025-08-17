import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id

    // Check if user is authenticated and is admin
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`Fetching customer details for ID: ${customerId}`)

    // Get customer basic info
    const customerResult = await sql`
      SELECT 
        id,
        name,
        email,
        phone,
        address,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = ${customerId}
      AND (role IS NULL OR role != 'admin')
    `

    if (customerResult.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = customerResult[0]

    // Get customer orders
    const orders = await sql`
      SELECT 
        id,
        total,
        total_amount,
        status,
        created_at,
        updated_at
      FROM orders
      WHERE user_id = ${customerId}
      ORDER BY created_at DESC
    `

    // Calculate customer statistics
    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => {
        const amount = Number(order.total || order.total_amount || 0)
        return sum + amount
      }, 0),
      avgOrderValue: 0,
      lastOrderDate: orders.length > 0 ? orders[0].created_at : null,
      firstOrderDate: orders.length > 0 ? orders[orders.length - 1].created_at : null,
    }

    stats.avgOrderValue = stats.totalOrders > 0 ? stats.totalSpent / stats.totalOrders : 0

    // Get order status breakdown
    const statusBreakdown = orders.reduce(
      (acc, order) => {
        const status = order.status || "pending"
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        status: stats.totalOrders > 0 ? "active" : "inactive",
      },
      orders: orders.map((order) => ({
        ...order,
        total: Number(order.total || order.total_amount || 0),
      })),
      stats,
      statusBreakdown,
    })
  } catch (error) {
    console.error("Error fetching customer details:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customer details",
      },
      { status: 500 },
    )
  }
}
