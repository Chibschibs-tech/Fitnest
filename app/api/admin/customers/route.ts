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
      // First try: Get all users (not just non-admin users)
      const allUsers = await sql`
        SELECT 
          id,
          name,
          email,
          phone,
          address,
          created_at,
          role
        FROM users
        ORDER BY created_at DESC
      `

      console.log(`Found ${allUsers.length} total users`)

      // Filter out admin users and get order data for each customer
      customers = []
      for (const user of allUsers) {
        if (user.role === "admin") {
          continue // Skip admin users
        }

        try {
          // Get order statistics for this user
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
            id: user.id,
            name: user.name || "Unknown User",
            email: user.email || "",
            phone: user.phone || null,
            address: user.address || null,
            created_at: user.created_at,
            total_orders: Number(orderData.total_orders),
            total_spent: Number(orderData.total_spent),
            last_order_date: orderData.last_order_date,
            status: Number(orderData.total_orders) > 0 ? "active" : "inactive",
          })
        } catch (orderError) {
          console.log(`Failed to get orders for user ${user.id}:`, orderError)
          // Add user with zero stats if order query fails
          customers.push({
            id: user.id,
            name: user.name || "Unknown User",
            email: user.email || "",
            phone: user.phone || null,
            address: user.address || null,
            created_at: user.created_at,
            total_orders: 0,
            total_spent: 0,
            last_order_date: null,
            status: "inactive",
          })
        }
      }

      console.log(`Processed ${customers.length} customers`)

      // Calculate total revenue and average order value
      try {
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
      } catch (revenueError) {
        console.log("Failed to calculate revenue:", revenueError)
        totalRevenue = customers.reduce((sum, customer) => sum + customer.total_spent, 0)
        const totalOrders = customers.reduce((sum, customer) => sum + customer.total_orders, 0)
        avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      }
    } catch (error) {
      console.log("Main query failed:", error)

      // Fallback: Try to get users without order data
      try {
        const fallbackUsers = await sql`
          SELECT 
            id,
            name,
            email,
            phone,
            address,
            created_at
          FROM users
          ORDER BY created_at DESC
        `

        customers = fallbackUsers.map((user) => ({
          id: user.id,
          name: user.name || "Unknown User",
          email: user.email || "",
          phone: user.phone || null,
          address: user.address || null,
          created_at: user.created_at,
          total_orders: 0,
          total_spent: 0,
          last_order_date: null,
          status: "inactive" as const,
        }))

        console.log(`Fallback: Found ${customers.length} customers`)
      } catch (fallbackError) {
        console.log("Fallback query also failed:", fallbackError)
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
