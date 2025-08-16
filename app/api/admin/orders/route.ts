import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const orders = await sql`
      SELECT 
        o.id,
        o.customer_name as "customerName",
        o.customer_email as "customerEmail", 
        o.plan_name as "planName",
        o.total_amount as "totalAmount",
        o.status,
        o.created_at as "createdAt",
        o.delivery_start_date as "deliveryStartDate",
        o.duration
      FROM orders o
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({
      success: true,
      orders: orders || [],
    })
  } catch (error) {
    console.error("Error fetching admin orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}
