import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get subscription orders
    const subscriptions = await sql`
      SELECT 
        o.id,
        COALESCE(u.name, o.customer_name, 'Guest Customer') as "customerName",
        COALESCE(u.email, o.customer_email, 'guest@example.com') as "customerEmail",
        mp.name as "mealPlanName",
        o.total,
        CASE 
          WHEN o.status = 'completed' THEN 'active'
          WHEN o.status = 'cancelled' THEN 'cancelled'
          ELSE 'active'
        END as status,
        o.created_at as "createdAt",
        'weekly' as "deliveryFrequency",
        o.created_at + INTERVAL '7 days' as "nextDelivery"
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN meal_plans mp ON o.meal_plan_id = mp.id
      WHERE o.order_type = 'subscription' OR mp.id IS NOT NULL
      ORDER BY o.created_at DESC
    `

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}
