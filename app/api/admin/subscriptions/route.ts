import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get subscription orders
    const subscriptions = await sql`
      SELECT 
        o.id,
        o.user_id,
        COALESCE(u.name, o.customer_name, 'Guest Customer') as customer_name,
        COALESCE(u.email, o.customer_email, 'guest@example.com') as customer_email,
        COALESCE(mp.name, 'Custom Plan') as plan_name,
        CASE 
          WHEN o.status = 'cancelled' THEN 'cancelled'
          WHEN o.status = 'completed' THEN 'active'
          ELSE 'active'
        END as status,
        o.total as weekly_price,
        o.created_at as start_date,
        o.created_at + INTERVAL '7 days' as next_delivery,
        1 as total_orders,
        o.total as total_spent,
        o.created_at
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN meal_plans mp ON o.meal_plan_id = mp.id
      WHERE o.order_type = 'subscription' OR mp.id IS NOT NULL
      ORDER BY o.created_at DESC
    `

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
