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
        p.featured_image_url,
        COUNT(DISTINCT spi.id) as item_count,
        COUNT(DISTINCT asub.id) as subscriber_count,
        COALESCE(SUM(CASE WHEN asub.status = 'active' THEN asub.billing_amount ELSE 0 END), 0) as monthly_revenue
      FROM subscription_plans sp
      JOIN products p ON sp.product_id = p.id
      LEFT JOIN subscription_plan_items spi ON sp.id = spi.plan_id
      LEFT JOIN active_subscriptions asub ON sp.id = asub.plan_id
      GROUP BY sp.id, p.name, p.slug, p.featured_image_url
      ORDER BY sp.created_at DESC
    `

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Error fetching subscription plans:", error)
    return NextResponse.json({ error: "Failed to fetch subscription plans" }, { status: 500 })
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
      billing_interval = 1,
      price,
      setup_fee = 0,
      trial_period_days = 0,
      trial_price = 0,
      max_subscribers,
      subscription_length,
      delivery_frequency,
      items_per_delivery,
    } = body

    const [plan] = await sql`
      INSERT INTO subscription_plans (
        product_id, name, description, billing_period, billing_interval,
        price, setup_fee, trial_period_days, trial_price, max_subscribers,
        subscription_length, delivery_frequency, items_per_delivery, is_active
      ) VALUES (
        ${product_id}, ${name}, ${description}, ${billing_period}, ${billing_interval},
        ${price}, ${setup_fee}, ${trial_period_days}, ${trial_price}, ${max_subscribers},
        ${subscription_length}, ${delivery_frequency}, ${items_per_delivery}, true
      ) RETURNING *
    `

    return NextResponse.json({ plan })
  } catch (error) {
    console.error("Error creating subscription plan:", error)
    return NextResponse.json({ error: "Failed to create subscription plan" }, { status: 500 })
  }
}
