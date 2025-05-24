import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get user's active subscription (most recent order)
    const userOrders = await sql`
      SELECT * FROM orders 
      WHERE user_id = ${user.id} 
      ORDER BY created_at DESC 
      LIMIT 1
    `

    const activeSubscription = userOrders.length > 0 ? userOrders[0] : null

    // Get upcoming deliveries (next 5 days)
    const now = new Date()
    const fiveDaysLater = new Date(now)
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 5)

    const upcomingDeliveries = await sql`
      SELECT * FROM orders 
      WHERE user_id = ${user.id} 
      AND delivery_date >= ${now.toISOString()} 
      AND status = 'pending'
      ORDER BY delivery_date ASC 
      LIMIT 5
    `

    // Get order history (last 10 orders)
    const orderHistory = await sql`
      SELECT * FROM orders 
      WHERE user_id = ${user.id} 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    return NextResponse.json({
      activeSubscription: activeSubscription
        ? {
            ...activeSubscription,
            planDetails: { name: "Sample Plan", description: "Sample meal plan" },
          }
        : null,
      upcomingDeliveries,
      orderHistory,
      userProfile: user,
    })
  } catch (error) {
    console.error("Error fetching user dashboard data:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
