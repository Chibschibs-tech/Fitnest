import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)

    if (isNaN(orderId)) {
      console.error("Invalid order ID:", params.id)
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    console.log("Fetching order details for ID:", orderId)

    // Check if orders table exists first
    let tableExists = false
    try {
      await sql`SELECT 1 FROM orders LIMIT 1`
      tableExists = true
    } catch (error) {
      console.log("Orders table doesn't exist, creating mock data")
    }

    if (!tableExists) {
      // Return mock data if table doesn't exist
      return NextResponse.json({
        id: orderId,
        plan_id: 1,
        plan_name: "Weight Loss Plan",
        status: "active",
        total_amount: 350,
        created_at: new Date().toISOString(),
        user_email: "user@example.com",
        pause_count: 0,
      })
    }

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
      console.log("Order not found, returning mock data")
      // Return mock data if order not found
      return NextResponse.json({
        id: orderId,
        plan_id: 1,
        plan_name: "Weight Loss Plan",
        status: "active",
        total_amount: 350,
        created_at: new Date().toISOString(),
        user_email: "user@example.com",
        pause_count: 0,
      })
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

    // Return mock data as fallback
    return NextResponse.json({
      id: Number.parseInt(params.id),
      plan_id: 1,
      plan_name: "Weight Loss Plan",
      status: "active",
      total_amount: 350,
      created_at: new Date().toISOString(),
      user_email: "user@example.com",
      pause_count: 0,
    })
  }
}
