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

    // Get all orders with additional order-specific information
    const orders = await sql`
      SELECT 
        o.id,
        o.customer_name,
        o.customer_email,
        o.plan_name,
        o.total_amount,
        o.status,
        o.created_at,
        CASE 
          WHEN o.delivery_frequency IS NOT NULL THEN 'subscription'
          ELSE 'one-time'
        END as order_type
      FROM orders o
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({
      success: true,
      orders: orders || [],
    })
  } catch (error) {
    console.error("Error fetching all orders:", error)
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
