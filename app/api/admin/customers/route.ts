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

    // Get customers with order statistics
    const customers = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.city,
        COALESCE(order_stats.total_orders, 0) as total_orders,
        COALESCE(order_stats.total_spent, 0) as total_spent,
        COALESCE(order_stats.last_order_date, null) as last_order_date,
        CASE 
          WHEN sub.status IS NOT NULL THEN sub.status
          ELSE 'none'
        END as subscription_status,
        u.created_at
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id,
          COUNT(*) as total_orders,
          SUM(total) as total_spent,
          MAX(created_at) as last_order_date
        FROM orders
        WHERE user_id IS NOT NULL
        GROUP BY user_id
      ) order_stats ON u.id = order_stats.user_id
      LEFT JOIN (
        SELECT DISTINCT user_id, 'active' as status
        FROM orders 
        WHERE order_type = 'subscription' 
        AND status != 'cancelled'
      ) sub ON u.id = sub.user_id
      WHERE u.role != 'admin'
      ORDER BY u.created_at DESC
    `

    return NextResponse.json({
      success: true,
      customers: customers,
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customers",
        customers: [],
      },
      { status: 500 },
    )
  }
}
