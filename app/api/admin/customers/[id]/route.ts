import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customerId = params.id

    // Get customer details
    const customerResult = await sql`
      SELECT 
        id,
        name,
        email,
        phone,
        address,
        created_at
      FROM users
      WHERE id = ${customerId}
    `

    if (customerResult.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = customerResult[0]

    // Get customer orders
    const orders = await sql`
      SELECT 
        id,
        COALESCE(
          CASE 
            WHEN total IS NOT NULL THEN total
            WHEN total_amount IS NOT NULL THEN total_amount
            ELSE 0
          END, 
          0
        ) as total_amount,
        status,
        created_at,
        delivery_date
      FROM orders
      WHERE user_id = ${customerId}
      ORDER BY created_at DESC
    `

    // Calculate statistics
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
    const lastOrderDate = orders.length > 0 ? orders[0].created_at : null

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        total_orders: totalOrders,
        total_spent: totalSpent,
        last_order_date: lastOrderDate,
        status: totalOrders > 0 ? "active" : "inactive",
      },
      orders: orders,
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
