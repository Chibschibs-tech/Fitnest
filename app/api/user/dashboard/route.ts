import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get session ID from cookies
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "No session found" }, { status: 401 })
    }

    // Use the existing session authentication system
    const user = await getSessionUser(sessionId)

    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Get user dashboard data
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
      },
      stats: {
        totalOrders: 0,
        activeSubscriptions: 0,
        upcomingDeliveries: 0,
      },
      recentOrders: [],
      upcomingDeliveries: [],
    }

    // Try to get orders data if table exists
    try {
      const orders = await sql`
        SELECT COUNT(*) as count 
        FROM orders 
        WHERE user_id = ${user.id}
      `
      dashboardData.stats.totalOrders = orders[0]?.count || 0

      const recentOrders = await sql`
        SELECT * FROM orders 
        WHERE user_id = ${user.id}
        ORDER BY created_at DESC 
        LIMIT 5
      `
      dashboardData.recentOrders = recentOrders
    } catch (error) {
      console.log("Orders table not available:", error.message)
    }

    return NextResponse.json({
      status: "success",
      data: dashboardData,
    })
  } catch (error) {
    console.error("Error fetching user dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
