import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get all deliveries with customer information
    const deliveries = await sql`
      SELECT 
        o.id,
        o.id as order_id,
        u.name as customer_name,
        u.email as customer_email,
        COALESCE(o.delivery_address, u.address, 'No address provided') as delivery_address,
        COALESCE(o.delivery_date, CURRENT_DATE + INTERVAL '1 day') as delivery_date,
        COALESCE(o.delivery_time, '12:00') as delivery_time,
        CASE 
          WHEN o.status = 'delivered' THEN 'delivered'
          WHEN o.status = 'active' THEN 'pending'
          WHEN o.status = 'processing' THEN 'in_transit'
          ELSE 'pending'
        END as status,
        o.notes,
        o.created_at,
        o.total_amount
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `

    // Transform the data to ensure proper types
    const transformedDeliveries = deliveries.map((delivery) => ({
      id: Number(delivery.id),
      order_id: Number(delivery.order_id),
      customer_name: delivery.customer_name || "Unknown Customer",
      customer_email: delivery.customer_email || "",
      delivery_address: delivery.delivery_address || "No address provided",
      delivery_date: delivery.delivery_date,
      delivery_time: delivery.delivery_time || "12:00",
      status: delivery.status as "pending" | "in_transit" | "delivered" | "failed",
      notes: delivery.notes || "",
      created_at: delivery.created_at,
      total_amount: Number(delivery.total_amount) || 0,
    }))

    return NextResponse.json({
      success: true,
      deliveries: transformedDeliveries,
      total: transformedDeliveries.length,
    })
  } catch (error) {
    console.error("Error fetching deliveries:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch deliveries",
        deliveries: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
