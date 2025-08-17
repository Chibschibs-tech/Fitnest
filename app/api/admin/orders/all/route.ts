import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get all orders with customer information and item counts
    const orders = await sql`
      SELECT 
        o.id,
        u.name as "customerName",
        u.email as "customerEmail",
        o.order_type as "orderType",
        o.total,
        o.status,
        o.created_at as "createdAt",
        COALESCE(oi.item_count, 0) as "itemCount"
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN (
        SELECT 
          order_id, 
          COUNT(*) as item_count 
        FROM order_items 
        GROUP BY order_id
      ) oi ON o.id = oi.order_id
      ORDER BY o.created_at DESC
    `

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
