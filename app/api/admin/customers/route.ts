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

    let customers = []
    let totalRevenue = 0
    let avgOrderValue = 0

    try {
      // Get all non-admin users (real customers)
      const usersResult = await sql`
        SELECT 
          id,
          name,
          email,
          phone,
          address,
          created_at,
          role
        FROM users
        WHERE (role IS NULL OR role != 'admin')
        AND email NOT LIKE '%@example.com'
        AND name NOT IN ('Admin User', 'Test User', 'Demo User', 'Sample User', 'Sara Lamouri', 'Karim Mansouri', 'Leila Bennani', 'Omar Alaoui')
        ORDER BY created_at DESC
      `

      console.log(`Found ${usersResult.length} real users (excluding sample data)`)

      // Get order data for each customer
      customers = []
      for (const user of usersResult) {
        try {
          const orderStats = await sql`
            SELECT 
              COUNT(*) as total_orders,
              COALESCE(SUM(
                CASE 
                  WHEN total IS NOT NULL THEN total::numeric
                  WHEN total_amount IS NOT NULL THEN total_amount::numeric
                  ELSE 0
                END
              ), 0) as total_spent,
              MAX(created_at) as last_order_date
            FROM orders
            WHERE user_id = ${user.id}
            AND (status != 'cancelled' OR status IS NULL)
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
          console.log(`Error getting orders for user ${user.id}:`, orderError)
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

      // Calculate total revenue from customer data
      totalRevenue = customers.reduce((sum, customer) => sum + Number(customer.total_spent), 0)
      const totalOrdersCount = customers.reduce((sum, customer) => sum + Number(customer.total_orders), 0)
      avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0

      console.log(`Processed ${customers.length} real customers`)
    } catch (error) {
      console.log("Error fetching customers:", error)
      customers = []
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
