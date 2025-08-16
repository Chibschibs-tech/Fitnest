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

    // Get paused subscriptions with customer details
    const pausedSubscriptions = await sql`
      SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email,
        mp.name as plan_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN meal_plans mp ON o.plan_id = mp.id
      WHERE o.status = 'paused'
      ORDER BY o.paused_at DESC
    `

    return NextResponse.json({
      success: true,
      subscriptions: pausedSubscriptions,
      count: pausedSubscriptions.length,
    })
  } catch (error) {
    console.error("Error fetching paused subscriptions:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
