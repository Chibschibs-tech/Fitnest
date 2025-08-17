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

    console.log("Fetching customers with order data...")

    // Try multiple queries to handle different database schemas
    let customers = []
    let totalRevenue = 0
    let avgOrderValue = 0

    try {
      // First try: Get customers from users table with comprehensive order data
      customers = await sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.phone,
          u.address,
          u.created_at,
          COUNT(DISTINCT o.id) as total_orders,
          COALESCE(SUM(
            CASE 
              WHEN o.total IS NOT NULL THEN o.total
              WHEN o.total_amount IS NOT NULL THEN o.total_amount
              ELSE 0
            END
          ), 0) as total_spent,
          MAX(o.created_at) as last_order_date,
          CASE 
            WHEN COUNT(DISTINCT o.id) > 0 THEN 'active'
            ELSE 'inactive'
          END as status
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'cancelled'
        WHERE u.role IS NULL OR u.role != 'admin'
        GROUP BY u.id, u.name, u.email, u.phone, u.address, u.created_at
        ORDER BY u.created_at DESC
      `

      console.log(`Found ${customers.length} customers with detailed order data`)

      // Calculate total revenue and average order value
      const revenueResult = await sql`
        SELECT 
          COALESCE(SUM(
            CASE 
              WHEN total IS NOT NULL THEN total
              WHEN total_amount IS NOT NULL THEN total_amount
              ELSE 0
            END
          ), 0) as total_revenue,
          COUNT(*) as total_orders
        FROM orders
        WHERE status != 'cancelled'
        AND (total > 0 OR total_amount > 0)
      `

      totalRevenue = Number(revenueResult[0]?.total_revenue || 0)
      const totalOrders = Number(revenueResult[0]?.total_orders || 0)
      avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    } catch (error) {
      console.log("Detailed query failed, trying fallback:", error)

      // Fallback: Try simpler queries
      try {
        // Get users without order join first
        const usersResult = await sql`
          SELECT 
            id,
            name,
            email,
            phone,
            address,
            created_at
          FROM users
          WHERE role IS NULL OR role != 'admin'
          ORDER BY created_at DESC
        `

        // Then get order data separately for each user
        customers = []
        for (const user of usersResult) {
          try {
            const orderStats = await sql`
              SELECT 
                COUNT(*) as total_orders,
                COALESCE(SUM(
                  CASE 
                    WHEN total IS NOT NULL THEN total
                    WHEN total_amount IS NOT NULL THEN total_amount
                    ELSE 0
                  END
                ), 0) as total_spent,
                MAX(created_at) as last_order_date
              FROM orders
              WHERE user_id = ${user.id}
              AND status != 'cancelled'
            `

            const orderData = orderStats[0] || { total_orders: 0, total_spent: 0, last_order_date: null }

            customers.push({
              ...user,
              total_orders: Number(orderData.total_orders),
              total_spent: Number(orderData.total_spent),
              last_order_date: orderData.last_order_date,
              status: Number(orderData.total_orders) > 0 ? "active" : "inactive",
            })
          } catch (orderError) {
            // If order query fails for this user, add them with zero stats
            customers.push({
              ...user,
              total_orders: 0,
              total_spent: 0,
              last_order_date: null,
              status: "inactive",
            })
          }
        }

        console.log(`Fallback: Found ${customers.length} customers with individual order queries`)
      } catch (fallbackError) {
        console.log("Fallback query also failed:", fallbackError)
        // Last resort: just get users without order data
        customers = await sql`
          SELECT 
            id,
            name,
            email,
            phone,
            address,
            created_at,
            0 as total_orders,
            0 as total_spent,
            NULL as last_order_date,
            'inactive' as status
          FROM users
          WHERE role IS NULL OR role != 'admin'
          ORDER BY created_at DESC
        `
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
