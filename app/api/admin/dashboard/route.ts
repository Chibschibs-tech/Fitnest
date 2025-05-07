import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { db, orders, users, mealPlans } from "@/lib/db"
import { eq, and, gte, count, sum } from "drizzle-orm"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get current date and date 30 days ago
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get total revenue for current month
    const revenueResult = await db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(and(gte(orders.createdAt, thirtyDaysAgo), eq(orders.status, "delivered")))

    const totalRevenue = revenueResult[0]?.total || 0

    // Get active subscriptions (users with active orders)
    const activeSubscriptionsResult = await db.select({ count: count() }).from(users).where(eq(users.role, "customer"))

    const activeSubscriptions = activeSubscriptionsResult[0]?.count || 0

    // Get total meals delivered
    const mealsDeliveredResult = await db
      .select({ count: count() })
      .from(orders)
      .where(and(gte(orders.createdAt, thirtyDaysAgo), eq(orders.status, "delivered")))

    const mealsDelivered = mealsDeliveredResult[0]?.count * 15 || 0 // Assuming 15 meals per order

    // Get recent orders
    const recentOrders = await db.select().from(orders).orderBy({ createdAt: "desc" }).limit(5)

    // Get popular meal plans
    const popularPlans = await db
      .select({
        id: mealPlans.id,
        name: mealPlans.name,
        count: count(),
      })
      .from(mealPlans)
      .leftJoin(orders, eq(mealPlans.id, orders.planId))
      .groupBy(mealPlans.id, mealPlans.name)
      .orderBy({ count: "desc" })
      .limit(4)

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
