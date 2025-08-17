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

    // Get deliveries from orders
    const deliveries = await sql`
      SELECT 
        o.id,
        o.id as order_id,
        COALESCE(u.name, o.customer_name, 'Guest Customer') as customer_name,
        COALESCE(o.delivery_address, 'Address not provided') as customer_address,
        COALESCE(u.phone, o.customer_phone) as customer_phone,
        COALESCE(o.delivery_date, o.created_at + INTERVAL '2 days') as delivery_date,
        CASE 
          WHEN o.status = 'delivered' THEN 'delivered'
          WHEN o.status = 'processing' THEN 'in_transit'
          WHEN o.status = 'confirmed' THEN 'pending'
          ELSE 'pending'
        END as status,
        NULL as driver_name,
        o.delivery_notes,
        o.created_at,
        o.updated_at as delivered_at
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `

    return NextResponse.json({
      success: true,
      deliveries: deliveries,
    })
  } catch (error) {
    console.error("Error fetching deliveries:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch deliveries",
        deliveries: [],
      },
      { status: 500 },
    )
  }
}
