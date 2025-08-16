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

    // Get current date and date 30 days ago
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get total revenue for current month
    const revenueResult = await sql`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM orders 
      WHERE created_at >= ${thirtyDaysAgo.toISOString()} 
      AND status IN ('active', 'completed', 'delivered')
    `

    const totalRevenue = revenueResult[0]?.total || 0

    // Get active subscriptions count
    const activeSubscriptionsResult = await sql`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE status = 'active'
    `

    const activeSubscriptions = activeSubscriptionsResult[0]?.count || 0

    // Get paused subscriptions count
    const pausedSubscriptionsResult = await sql`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE status = 'paused'
    `

    const pausedSubscriptions = pausedSubscriptionsResult[0]?.count || 0

    // Get pending deliveries count
    let pendingDeliveries = 0
    let todayDeliveries = 0

    try {
      const deliveryResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/admin/get-pending-deliveries`,
      )
      if (deliveryResponse.ok) {
        const deliveryData = await deliveryResponse.json()
        pendingDeliveries = deliveryData.pendingDeliveries || 0

        // Count today's deliveries
        const today = new Date().toDateString()
        todayDeliveries =
          deliveryData.deliveries?.filter((d: any) => new Date(d.deliveryDate).toDateString() === today).length || 0
      }
    } catch (error) {
      console.log("Could not fetch delivery data:", error)
    }

    // Get waitlist count
    let waitlistCount = 0
    try {
      const waitlistResult = await sql`
        SELECT COUNT(*) as count FROM waitlist
      `
      waitlistCount = waitlistResult[0]?.count || 0
    } catch (error) {
      console.log("Waitlist table not found:", error)
    }

    // Get Express Shop orders count
    let expressShopOrders = 0
    try {
      // This would be from a separate express shop orders table when implemented
      expressShopOrders = 0
    } catch (error) {
      console.log("Express shop data not available:", error)
    }

    // Get recent orders
    const recentOrders = await sql`
      SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC 
      LIMIT 10
    `

    // Get popular plans data
    const popularPlansResult = await sql`
      SELECT 
        plan_id,
        COUNT(*) as order_count,
        mp.name as plan_name
      FROM orders o
      LEFT JOIN meal_plans mp ON o.plan_id = mp.id
      WHERE o.created_at >= ${thirtyDaysAgo.toISOString()}
      GROUP BY plan_id, mp.name
      ORDER BY order_count DESC
      LIMIT 4
    `

    const popularPlans = popularPlansResult.map((plan: any) => ({
      id: plan.plan_id,
      name: plan.plan_name || `Plan ${plan.plan_id}`,
      count: plan.order_count,
    }))

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
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
