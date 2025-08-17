import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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

    console.log("Fetching deliveries for admin...")

    let deliveries = []

    try {
      // Get all deliveries with customer information
      deliveries = await sql`
        SELECT 
          o.id,
          o.id as order_id,
          COALESCE(u.name, o.customer_name, 'Unknown Customer') as customer_name,
          COALESCE(u.email, o.customer_email, 'no-email@example.com') as customer_email,
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
          COALESCE(o.total_amount, o.total, 0) as total_amount
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `
    } catch (deliveryError) {
      console.log("Delivery query with users failed:", deliveryError)

      // Fallback: get orders without user join
      try {
        deliveries = await sql`
          SELECT 
            id,
            id as order_id,
            COALESCE(customer_name, 'Unknown Customer') as customer_name,
            COALESCE(customer_email, 'no-email@example.com') as customer_email,
            COALESCE(delivery_address, 'No address provided') as delivery_address,
            COALESCE(delivery_date, CURRENT_DATE + INTERVAL '1 day') as delivery_date,
            COALESCE(delivery_time, '12:00') as delivery_time,
            CASE 
              WHEN status = 'delivered' THEN 'delivered'
              WHEN status = 'active' THEN 'pending'
              WHEN status = 'processing' THEN 'in_transit'
              ELSE 'pending'
            END as status,
            notes,
            created_at,
            COALESCE(total_amount, total, 0) as total_amount
          FROM orders
          ORDER BY created_at DESC
        `
      } catch (simpleError) {
        console.log("Simple orders query failed:", simpleError)
        deliveries = []
      }
    }

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

    console.log(`Found ${transformedDeliveries.length} deliveries`)

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
        error: error instanceof Error ? error.message : "Unknown error",
        deliveries: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
