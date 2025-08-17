import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get deliveries from orders with delivery information
    const deliveries = await sql`
      SELECT 
        o.id,
        COALESCE(u.name, o.customer_name, 'Guest Customer') as "customerName",
        COALESCE(u.email, o.customer_email, 'guest@example.com') as "customerEmail",
        COALESCE(o.delivery_address, 'Address not provided') as address,
        COALESCE(o.delivery_date, o.created_at + INTERVAL '2 days') as "deliveryDate",
        CASE 
          WHEN o.status = 'completed' THEN 'delivered'
          WHEN o.status = 'processing' THEN 'in_transit'
          WHEN o.status = 'confirmed' THEN 'scheduled'
          ELSE 'scheduled'
        END as status,
        o.total as "orderTotal",
        NULL as "driverName",
        CONCAT('TRK', LPAD(o.id::text, 8, '0')) as "trackingNumber",
        o.created_at as "createdAt"
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `

    return NextResponse.json(deliveries)
  } catch (error) {
    console.error("Error fetching deliveries:", error)
    return NextResponse.json({ error: "Failed to fetch deliveries" }, { status: 500 })
  }
}
