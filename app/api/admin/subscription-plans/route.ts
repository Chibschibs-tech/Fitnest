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

    const plans = await sql`
      SELECT 
        sp.*,
        p.name as product_name,
        p.slug as product_slug,
        COUNT(DISTINCT spi.id) as item_count,
        COUNT(DISTINCT as_sub.id) as subscriber_count,
        COALESCE(SUM(as_sub.billing_amount), 0) as monthly_revenue
      FROM subscription_plans sp
      LEFT JOIN products p ON sp.product_id = p.id
      LEFT JOIN subscription_plan_items spi ON sp.id = spi.plan_id
      LEFT JOIN active_subscriptions as_sub ON sp.id = as_sub.plan_id AND as_sub.status = 'active'
      GROUP BY sp.id, p.name, p.slug
      ORDER BY sp.created_at DESC
    `

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Error fetching subscription plans:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      product_id,
      name,
      description,
      billing_period,
      billing_interval,
      price,
      trial_period_days,
      delivery_frequency,
      items_per_delivery,
    } = body

    const [plan] = await sql`
      INSERT INTO subscription_plans (
        product_id, name, description, billing_period, billing_interval,
        price, trial_period_days, delivery_frequency, items_per_delivery
      ) VALUES (
        ${product_id}, ${name}, ${description}, ${billing_period}, ${billing_interval},
        ${price}, ${trial_period_days}, ${delivery_frequency}, ${items_per_delivery}
      ) RETURNING *
    `

    return NextResponse.json({ plan })
  } catch (error) {
    console.error("Error creating subscription plan:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
