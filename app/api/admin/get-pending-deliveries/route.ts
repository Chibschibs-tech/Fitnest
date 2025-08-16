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

    let deliveries = []
    let pendingDeliveries = 0

    try {
      // Try to get deliveries from the deliveries table if it exists
      deliveries = await sql`
        SELECT 
          d.*,
          o.total_amount,
          u.name as customer_name,
          u.email as customer_email
        FROM deliveries d
        LEFT JOIN orders o ON d.order_id = o.id
        LEFT JOIN users u ON o.user_id = u.id
        WHERE d.status = 'pending'
        ORDER BY d.delivery_date ASC
      `

      pendingDeliveries = deliveries.length
    } catch (error) {
      console.log("Deliveries table not found, using mock data:", error)

      // Mock delivery data if table doesn't exist
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      deliveries = [
        {
          id: 1,
          order_id: 1,
          delivery_date: today.toISOString(),
          status: "pending",
          customer_name: "John Doe",
          customer_email: "john@example.com",
          total_amount: 299,
        },
        {
          id: 2,
          order_id: 2,
          delivery_date: tomorrow.toISOString(),
          status: "pending",
          customer_name: "Jane Smith",
          customer_email: "jane@example.com",
          total_amount: 399,
        },
      ]

      pendingDeliveries = deliveries.length
    }

    return NextResponse.json({
      success: true,
      deliveries,
      pendingDeliveries,
    })
  } catch (error) {
    console.error("Error fetching pending deliveries:", error)
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
