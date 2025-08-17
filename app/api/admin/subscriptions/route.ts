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

    // Get all subscriptions (orders with recurring delivery)
    const subscriptions = await sql`
      SELECT 
        o.id,
        o.customer_name,
        o.customer_email,
        o.plan_name,
        o.total_amount,
        o.status,
        o.delivery_frequency,
        o.duration_weeks,
        o.created_at
      FROM orders o
      WHERE o.delivery_frequency IS NOT NULL
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions || [],
    })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
