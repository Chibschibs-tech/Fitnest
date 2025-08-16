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

    let orders = []

    try {
      // Get all orders with customer details
      orders = await sql`
        SELECT 
          o.*,
          u.name as customer_name,
          u.email as customer_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `
    } catch (error) {
      console.error("Error fetching orders:", error)
      orders = []
    }

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
    })
  } catch (error) {
    console.error("Error in admin orders API:", error)
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
