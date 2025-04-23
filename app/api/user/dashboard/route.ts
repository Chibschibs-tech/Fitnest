import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { db, orders, mealPlans, users } from "@/lib/db"
import { eq, and, gte } from "drizzle-orm"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)

    // Get user's active subscription (most recent order)
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy({ createdAt: "desc" })
      .limit(1)

    const activeSubscription = userOrders.length > 0 ? userOrders[0] : null

    // Get plan details if there's an active subscription
    let planDetails = null
    if (activeSubscription) {
      const plans = await db.select().from(mealPlans).where(eq(mealPlans.id, activeSubscription.planId)).limit(1)
      planDetails = plans.length > 0 ? plans[0] : null
    }

    // Get upcoming deliveries (next 5 days)
    const now = new Date()
    const fiveDaysLater = new Date(now)
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 5)

    const upcomingDeliveries = await db
      .select()
      .from(orders)
      .where(and(eq(orders.userId, userId), gte(orders.deliveryDate, now), eq(orders.status, "pending")))
      .orderBy({ deliveryDate: "asc" })
      .limit(5)

    // Get order history (last 10 orders)
    const orderHistory = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy({ createdAt: "desc" })
      .limit(10)

    // Get user profile
    const userProfile = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    return NextResponse.json({
      activeSubscription: activeSubscription
        ? {
            ...activeSubscription,
            planDetails,
          }
        : null,
      upcomingDeliveries,
      orderHistory,
      userProfile: userProfile.length > 0 ? userProfile[0] : null,
    })
  } catch (error) {
    console.error("Error fetching user dashboard data:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
