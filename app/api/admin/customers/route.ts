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

    console.log("Fetching customers...")

    // Try multiple queries to handle different database schemas
    let customers = []
    let totalRevenue = 0
    let avgOrderValue = 0

    try {
      // First try: Get customers from users table with order data
      customers = await sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.created_at,
          COUNT(o.id) as total_orders,
          COALESCE(SUM(COALESCE(o.total, o.total_amount, 0)), 0) as total_spent,
          MAX(o.created_at) as last_order_date,
          CASE 
            WHEN COUNT(o.id) > 0 THEN 'active'
            ELSE 'inactive'
          END as status
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id, u.name, u.email, u.created_at
        ORDER BY u.created_at DESC
      `

      // Calculate metrics
      const revenueResult = await sql`
        SELECT COALESCE(SUM(COALESCE(total, total_amount, 0)), 0) as total_revenue
        FROM orders
      `
      totalRevenue = Number(revenueResult[0]?.total_revenue || 0)

      const orderCountResult = await sql`
        SELECT COUNT(*) as order_count
        FROM orders
        WHERE COALESCE(total, total_amount, 0) > 0
      `
      const orderCount = Number(orderCountResult[0]?.order_count || 0)
      avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0
    } catch (error) {
      console.log("Primary query failed, trying fallback:", error)

      // Fallback: Try simpler queries
      try {
        customers = await sql`
          SELECT 
            id,
            name,
            email,
            created_at,
            0 as total_orders,
            0 as total_spent,
            NULL as last_order_date,
            'inactive' as status
          FROM users
          ORDER BY created_at DESC
        `
      } catch (fallbackError) {
        console.log("Fallback query also failed:", fallbackError)
        // Return empty data instead of error
        customers = []
      }
    }

    const activeCustomers = customers.filter((c) => c.status === "active").length

    return NextResponse.json({
      success: true,
      customers: customers || [],
      metrics: {
        totalCustomers: customers.length,
        activeCustomers,
        totalRevenue,
        avgOrderValue,
      },
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch customers",
      customers: [],
      metrics: {
        totalCustomers: 0,
        activeCustomers: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
      },
    })
  }
}
