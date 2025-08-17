import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("Fetching subscriptions...")

    // Get subscription data from orders table
    let subscriptions = []

    try {
      // Get orders that represent subscriptions
      subscriptions = await sql`
        SELECT 
          o.id,
          o.user_id,
          COALESCE(u.name, 'Unknown Customer') as customer_name,
          COALESCE(u.email, 'unknown@email.com') as customer_email,
          COALESCE(mp.name, 'Custom Plan') as plan_name,
          CASE 
            WHEN o.status = 'cancelled' THEN 'cancelled'
            WHEN o.status = 'completed' THEN 'active'
            WHEN o.status = 'pending' THEN 'active'
            ELSE 'active'
          END as status,
          COALESCE(
            CASE 
              WHEN o.total IS NOT NULL THEN o.total::numeric
              WHEN o.total_amount IS NOT NULL THEN o.total_amount::numeric
              WHEN mp.weekly_price IS NOT NULL THEN mp.weekly_price::numeric
              ELSE 0
            END, 
            0
          ) as weekly_price,
          o.created_at as start_date,
          (o.created_at + INTERVAL '7 days') as next_delivery,
          1 as total_orders,
          COALESCE(
            CASE 
              WHEN o.total IS NOT NULL THEN o.total::numeric
              WHEN o.total_amount IS NOT NULL THEN o.total_amount::numeric
              ELSE 0
            END, 
            0
          ) as total_spent,
          o.created_at,
          o.order_type
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN meal_plans mp ON o.meal_plan_id = mp.id
        WHERE (
          o.order_type = 'subscription' 
          OR mp.id IS NOT NULL
          OR o.total > 100
        )
        AND u.role != 'admin'
        ORDER BY o.created_at DESC
        LIMIT 100
      `

      console.log(`Found ${subscriptions.length} subscriptions`)
    } catch (error) {
      console.log("Error fetching subscriptions:", error)

      // Fallback: Get all orders as potential subscriptions
      try {
        subscriptions = await sql`
          SELECT 
            o.id,
            o.user_id,
            COALESCE(u.name, 'Unknown Customer') as customer_name,
            COALESCE(u.email, 'unknown@email.com') as customer_email,
            'Custom Plan' as plan_name,
            CASE 
              WHEN o.status = 'cancelled' THEN 'cancelled'
              ELSE 'active'
            END as status,
            COALESCE(
              CASE 
                WHEN o.total IS NOT NULL THEN o.total::numeric
                WHEN o.total_amount IS NOT NULL THEN o.total_amount::numeric
                ELSE 0
              END, 
              0
            ) as weekly_price,
            o.created_at as start_date,
            (o.created_at + INTERVAL '7 days') as next_delivery,
            1 as total_orders,
            COALESCE(
              CASE 
                WHEN o.total IS NOT NULL THEN o.total::numeric
                WHEN o.total_amount IS NOT NULL THEN o.total_amount::numeric
                ELSE 0
              END, 
              0
            ) as total_spent,
            o.created_at
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          WHERE u.role != 'admin' OR u.role IS NULL
          ORDER BY o.created_at DESC
          LIMIT 50
        `

        console.log(`Fallback: Found ${subscriptions.length} orders as subscriptions`)
      } catch (fallbackError) {
        console.log("Fallback query also failed:", fallbackError)
        subscriptions = []
      }
    }

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
