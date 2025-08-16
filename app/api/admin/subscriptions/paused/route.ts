import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const subscriptions = await sql`
      SELECT 
        o.id,
        o.customer_name as "customerName",
        o.customer_email as "customerEmail",
        o.plan_name as "planName",
        o.total_amount as "totalAmount",
        o.status,
        o.created_at as "createdAt",
        o.delivery_start_date as "deliveryStartDate",
        o.duration,
        GREATEST(0, o.duration - FLOOR(EXTRACT(EPOCH FROM (CURRENT_DATE - o.delivery_start_date::date)) / (7 * 24 * 3600))) as "remainingWeeks"
      FROM orders o
      WHERE o.status = 'paused'
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions || [],
    })
  } catch (error) {
    console.error("Error fetching paused subscriptions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch paused subscriptions" }, { status: 500 })
  }
}
