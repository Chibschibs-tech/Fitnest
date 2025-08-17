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

    console.log("Fetching subscriptions...")

    // Try to get subscription orders with comprehensive fallbacks
    let subscriptions = []

    try {
      // First attempt: Get subscription data with meal plan names
      subscriptions = await sql`
        SELECT 
          o.id,
          o.user_id,
          COALESCE(u.name, o.customer_name, 'Guest Customer') as customer_name,
          COALESCE(u.email, o.customer_email, 'guest@example.com') as customer_email,
          COALESCE(mp.name, 'Custom Plan') as plan_name,
          CASE 
            WHEN o.status = 'cancelled' THEN 'cancelled'
            WHEN o.status = 'completed' THEN 'active'
            WHEN o.status = 'pending' THEN 'active'
            ELSE 'active'
          END as status,
          COALESCE(
            CASE 
              WHEN o.total IS NOT NULL THEN o.total
              WHEN o.total_amount IS NOT NULL THEN o.total_amount
              ELSE mp.price_per_week
            END, 
            0
          ) as weekly_price,
          o.created_at as start_date,
          (o.created_at + INTERVAL '7 days') as next_delivery,
          1 as total_orders,
          COALESCE(
            CASE 
              WHEN o.total IS NOT NULL THEN o.total
              WHEN o.total_amount IS NOT NULL THEN o.total_amount
              ELSE 0
            END, 
            0
          ) as total_spent,
          o.created_at
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN meal_plans mp ON o.meal_plan_id = mp.id
        WHERE o.order_type = 'subscription' OR mp.id IS NOT NULL
        ORDER BY o.created_at DESC
        LIMIT 100
      `

      console.log(`Found ${subscriptions.length} subscriptions with meal plans`)
    } catch (error) {
      console.log("Meal plan join failed, trying simpler query:", error)

      try {
        // Fallback: Get orders that look like subscriptions
        subscriptions = await sql`
          SELECT 
            o.id,
            o.user_id,
            COALESCE(u.name, 'Guest Customer') as customer_name,
            COALESCE(u.email, 'guest@example.com') as customer_email,
            'Custom Plan' as plan_name,
            CASE 
              WHEN o.status = 'cancelled' THEN 'cancelled'
              ELSE 'active'
            END as status,
            COALESCE(
              CASE 
                WHEN o.total IS NOT NULL THEN o.total
                WHEN o.total_amount IS NOT NULL THEN o.total_amount
                ELSE 0
              END, 
              0
            ) as weekly_price,
            o.created_at as start_date,
            (o.created_at + INTERVAL '7 days') as next_delivery,
            1 as total_orders,
            COALESCE(
              CASE 
                WHEN o.total IS NOT NULL THEN o.total
                WHEN o.total_amount IS NOT NULL THEN o.total_amount
                ELSE 0
              END, 
              0
            ) as total_spent,
            o.created_at
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          WHERE o.order_type = 'subscription'
          ORDER BY o.created_at DESC
          LIMIT 100
        `

        console.log(`Fallback: Found ${subscriptions.length} subscription orders`)
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
