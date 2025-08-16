import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    console.log("Fetching order details for ID:", orderId)

    // Try to fetch from orders table
    const orders = await sql`
      SELECT 
        id,
        plan_id,
        status,
        total_amount,
        created_at,
        user_email,
        plan_name
      FROM orders 
      WHERE id = ${orderId}
      LIMIT 1
    `

    if (orders.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orders[0]

    return NextResponse.json({
      id: order.id,
      plan_id: order.plan_id,
      plan_name: order.plan_name || `Plan ${order.plan_id}`,
      status: order.status || "active",
      total_amount: order.total_amount,
      created_at: order.created_at,
      user_email: order.user_email,
      pause_count: 0, // Default since we don't have this column yet
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 })
  }
}
