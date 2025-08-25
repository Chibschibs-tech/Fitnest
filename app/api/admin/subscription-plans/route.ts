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

    // Get subscription plans with related data
    const plans = await sql`
      SELECT 
        sp.*,
        p.name as product_name,
        p.base_price as product_price,
        COUNT(DISTINCT spi.id) as item_count,
        COUNT(DISTINCT asub.id) as subscriber_count,
        COALESCE(SUM(asub.billing_amount), 0) as total_revenue
      FROM subscription_plans sp
      LEFT JOIN products p ON sp.product_id = p.id
      LEFT JOIN subscription_plan_items spi ON sp.id = spi.plan_id
      LEFT JOIN active_subscriptions asub ON sp.id = asub.plan_id AND asub.status = 'active'
      GROUP BY sp.id, p.name, p.base_price
      ORDER BY sp.created_at DESC
    `

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Get subscription plans error:", error)
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
      price,
      trial_period_days,
      delivery_frequency,
      items_per_delivery,
    } = body

    // Validate required fields
    if (!product_id || !name || !billing_period || !price) {
      return NextResponse.json(
        { error: "Missing required fields: product_id, name, billing_period, price" },
        { status: 400 },
      )
    }

    // Create subscription plan
    const result = await sql`
      INSERT INTO subscription_plans (
        product_id, name, description, billing_period, price,
        trial_period_days, delivery_frequency, items_per_delivery, is_active
      ) VALUES (
        ${product_id}, ${name}, ${description || ""}, ${billing_period}, ${price},
        ${trial_period_days || 0}, ${delivery_frequency || "weekly"}, 
        ${items_per_delivery || 1}, true
      ) RETURNING *
    `

    return NextResponse.json({ plan: result[0] })
  } catch (error) {
    console.error("Create subscription plan error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
