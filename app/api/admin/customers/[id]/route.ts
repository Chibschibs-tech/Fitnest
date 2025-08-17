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

    // Get customer details
    const customerResult = await sql`
      SELECT 
        id,
        name,
        email,
        phone,
        address,
        created_at,
        role
      FROM users
      WHERE id = ${customerId}
      AND (role IS NULL OR role != 'admin')
    `

    if (customerResult.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = customerResult[0]

    // Get customer's orders
    const ordersResult = await sql`
      SELECT 
        id,
        total,
        total_amount,
        status,
        created_at,
        meal_plan_name,
        delivery_date
      FROM orders
      WHERE user_id = ${customerId}
      ORDER BY created_at DESC
    `

    // Calculate customer stats
    const totalOrders = ordersResult.length
    const totalSpent = ordersResult.reduce((sum, order) => {
      const amount = order.total || order.total_amount || 0
      return sum + Number(amount)
    }, 0)

    const lastOrderDate = ordersResult.length > 0 ? ordersResult[0].created_at : null
    const status = totalOrders > 0 ? "active" : "inactive"

    const customerDetails = {
      ...customer,
      total_orders: totalOrders,
      total_spent: totalSpent,
      last_order_date: lastOrderDate,
      status,
      orders: ordersResult,
    }

    return NextResponse.json({
      success: true,
      customer: customerDetails,
    })
  } catch (error) {
    console.error("Error fetching customer details:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch customer details",
    })
  }
}
