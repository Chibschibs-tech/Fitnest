import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id

    // Check authentication
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log(`Fetching customer details for ID: ${customerId}`)

    // Get customer details
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
      AND (role IS NULL OR role = 'customer')
    `

    if (customerResult.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Customer not found",
      })
    }

    const customer = customerResult[0]

    // Get customer's orders - using only existing columns
    const orders = await sql`
      SELECT 
        id,
        status,
        total,
        total_amount,
        created_at,
        updated_at,
        order_type
      FROM orders 
      WHERE user_id = ${customerId}
      ORDER BY created_at DESC
    `

    // Calculate customer statistics
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => {
      const amount = Number(order.total || order.total_amount || 0)
      return sum + amount
    }, 0)

    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
    const lastOrderDate = orders.length > 0 ? orders[0].created_at : null
    const firstOrderDate = orders.length > 0 ? orders[orders.length - 1].created_at : null

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        total_orders: totalOrders,
        total_spent: totalSpent,
        avg_order_value: avgOrderValue,
        last_order_date: lastOrderDate,
        first_order_date: firstOrderDate,
        status: totalOrders > 0 ? "active" : "inactive",
      },
      orders: orders.map((order) => ({
        ...order,
        total: Number(order.total || order.total_amount || 0),
      })),
    })
  } catch (error) {
    console.error("Error fetching customer details:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch customer details",
    })
  }
}
