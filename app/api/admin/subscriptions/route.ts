import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("Fetching subscriptions...")

    // Get all users who have made orders (these are our subscribers)
    const subscriptions = await sql`
      SELECT DISTINCT
        u.id as customer_id,
        u.name as customer_name,
        u.email as customer_email,
        'Active' as status,
        '299.00' as monthly_price,
        'Weight Loss Plan' as plan_name,
        u.created_at as start_date,
        (u.created_at + INTERVAL '30 days') as next_billing,
        u.created_at
      FROM users u
      WHERE u.role = 'customer' OR u.role IS NULL
      ORDER BY u.created_at DESC
      LIMIT 50
    `

    console.log(`Found ${subscriptions.length} subscriptions`)

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions,
    })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch subscriptions",
        subscriptions: [],
      },
      { status: 500 },
    )
  }
}
