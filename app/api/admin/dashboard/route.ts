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

    // Get current date and date 30 days ago
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Initialize default values
    let totalRevenue = 0
    let activeSubscriptions = 0
    let pausedSubscriptions = 0
    let pendingDeliveries = 0
    let todayDeliveries = 0
    let waitlistCount = 0
    let expressShopOrders = 0
    let recentOrders = []
    let popularPlans = []

    try {
      // Get total revenue for current month
      const revenueResult = await sql`
        SELECT COALESCE(SUM(total_amount), 0) as total
        FROM orders 
        WHERE created_at >= ${thirtyDaysAgo.toISOString()} 
        AND status IN ('active', 'completed', 'delivered')
      `
      totalRevenue = Number(revenueResult[0]?.total) || 0
    } catch (error) {
      console.log("Revenue query failed:", error)
    }

    try {
      // Get active subscriptions count
      const activeSubscriptionsResult = await sql`
        SELECT COUNT(*) as count 
        FROM orders 
        WHERE status = 'active'
      `
      activeSubscriptions = Number(activeSubscriptionsResult[0]?.count) || 0
    } catch (error) {
      console.log("Active subscriptions query failed:", error)
    }

    try {
      // Get paused subscriptions count
      const pausedSubscriptionsResult = await sql`
        SELECT COUNT(*) as count 
        FROM orders 
        WHERE status = 'paused'
      `
      pausedSubscriptions = Number(pausedSubscriptionsResult[0]?.count) || 0
    } catch (error) {
      console.log("Paused subscriptions query failed:", error)
    }

    try {
      // Get waitlist count
      const waitlistResult = await sql`
        SELECT COUNT(*) as count FROM waitlist
      `
      waitlistCount = Number(waitlistResult[0]?.count) || 0
    } catch (error) {
      console.log("Waitlist table not found:", error)
    }

    try {
      // Get recent orders with user info
      recentOrders = await sql`
        SELECT 
          o.*,
          u.name as customer_name,
          u.email as customer_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC 
        LIMIT 10
      `
    } catch (error) {
      console.log("Recent orders query failed:", error)
    }

    try {
      // Get popular plans data - simplified version
      const popularPlansResult = await sql`
        SELECT 
          plan_id,
          COUNT(*) as order_count
        FROM orders o
        WHERE o.created_at >= ${thirtyDaysAgo.toISOString()}
        AND plan_id IS NOT NULL
        GROUP BY plan_id
        ORDER BY order_count DESC
        LIMIT 4
      `

      popularPlans = popularPlansResult.map((plan: any, index: number) => ({
        id: plan.plan_id,
        name: `Plan ${plan.plan_id}`,
        count: Number(plan.order_count),
      }))

      // Add some default popular plans if none exist
      if (popularPlans.length === 0) {
        popularPlans = [
          { id: 1, name: "Weight Loss Plan", count: 0 },
          { id: 2, name: "Muscle Gain Plan", count: 0 },
          { id: 3, name: "Keto Plan", count: 0 },
          { id: 4, name: "Balanced Plan", count: 0 },
        ]
      }
    } catch (error) {
      console.log("Popular plans query failed:", error)
      // Fallback data
      popularPlans = [
        { id: 1, name: "Weight Loss Plan", count: 0 },
        { id: 2, name: "Muscle Gain Plan", count: 0 },
        { id: 3, name: "Keto Plan", count: 0 },
        { id: 4, name: "Balanced Plan", count: 0 },
      ]
    }

    // Mock delivery data for now
    pendingDeliveries = Math.floor(Math.random() * 20) + 5
    todayDeliveries = Math.floor(Math.random() * 10) + 2
    expressShopOrders = Math.floor(Math.random() * 15) + 3

    return NextResponse.json({
      totalRevenue,
      activeSubscriptions,
      pausedSubscriptions,
      pendingDeliveries,
      todayDeliveries,
      waitlistCount,
      expressShopOrders,
      recentOrders,
      popularPlans,
    })
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error)
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
