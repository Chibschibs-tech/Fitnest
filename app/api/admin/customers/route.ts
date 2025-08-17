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
      // Get customers with order statistics
      const customers = await sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          COALESCE(order_stats.total_orders, 0) as "totalOrders",
          COALESCE(order_stats.total_spent, 0) as "totalSpent",
          order_stats.last_order_date as "lastOrderDate",
          CASE 
            WHEN COALESCE(order_stats.total_orders, 0) > 0 THEN 'active'
            ELSE 'inactive'
          END as status,
          u.created_at as "createdAt"
        FROM users u
        LEFT JOIN (
          SELECT 
            user_id,
            COUNT(*) as total_orders,
            SUM(total) as total_spent,
            MAX(created_at) as last_order_date
          FROM orders
          GROUP BY user_id
        ) order_stats ON u.id = order_stats.user_id
        WHERE u.role != 'admin'
        ORDER BY u.created_at DESC
      `

      return NextResponse.json(customers)
    } catch (dbError) {
      console.log("Error fetching customers, returning empty array:", dbError)
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
