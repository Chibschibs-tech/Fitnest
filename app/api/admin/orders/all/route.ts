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

    try {
      // Get all orders that are not subscriptions
      const orders = await sql`
        SELECT 
          o.id,
          COALESCE(u.name, o.customer_name, 'Guest Customer') as "customerName",
          COALESCE(u.email, o.customer_email, 'guest@example.com') as "customerEmail",
          CASE 
            WHEN o.order_type IS NOT NULL THEN o.order_type
            ELSE 'one_time'
          END as "orderType",
          o.total,
          o.status,
          o.created_at as "createdAt",
          1 as "itemCount"
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE COALESCE(o.order_type, 'one_time') != 'subscription'
        ORDER BY o.created_at DESC
        LIMIT 100
      `

      return NextResponse.json(orders)
    } catch (dbError) {
      console.log("Error fetching orders, returning empty array:", dbError)
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
