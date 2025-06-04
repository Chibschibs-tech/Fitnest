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

    // Get total revenue for current month
    const revenueResult = await sql`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM orders 
      WHERE created_at >= ${thirtyDaysAgo.toISOString()} 
      AND status = 'delivered'
    `

    const totalRevenue = revenueResult[0]?.total || 0

    // Get active subscriptions (users with active orders)
    const activeSubscriptionsResult = await sql`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE role = 'customer'
    `

    const activeSubscriptions = activeSubscriptionsResult[0]?.count || 0

    // Get total meals delivered
    const mealsDeliveredResult = await sql`
      SELECT COUNT(*) as count
      FROM orders 
      WHERE created_at >= ${thirtyDaysAgo.toISOString()} 
      AND status = 'delivered'
    `

    const mealsDelivered = (mealsDeliveredResult[0]?.count || 0) * 15 // Assuming 15 meals per order

    // Get recent orders
    const recentOrders = await sql`
      SELECT * FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `

    // Mock popular plans data since we don't have meal_plans table set up
    const popularPlans = [
      { id: 1, name: "Weight Loss Plan", count: 25 },
      { id: 2, name: "Muscle Gain Plan", count: 18 },
      { id: 3, name: "Keto Plan", count: 15 },
      { id: 4, name: "Balanced Plan", count: 12 },
    ]

    return NextResponse.json({
      totalRevenue,
      activeSubscriptions,
      mealsDelivered,
      recentOrders,
      popularPlans,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
