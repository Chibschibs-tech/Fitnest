import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all orders
    const orders = await sql`
      SELECT 
        o.id,
        COALESCE(u.name, o.customer_name, 'Guest Customer') as customer_name,
        COALESCE(u.email, o.customer_email, 'guest@example.com') as customer_email,
        o.status,
        o.total as total_amount,
        COALESCE(o.order_type, 'express_shop') as order_type,
        1 as items_count,
        o.created_at as order_date,
        o.delivery_date,
        'paid' as payment_status,
        COALESCE(o.delivery_address, 'Address not provided') as delivery_address
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `

    return NextResponse.json({
      success: true,
      orders: orders,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        orders: [],
      },
      { status: 500 },
    )
  }
}
