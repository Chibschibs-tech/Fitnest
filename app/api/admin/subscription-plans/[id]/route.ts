import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const planId = Number.parseInt(params.id)

    const [plan] = await sql`
      SELECT 
        sp.*,
        p.name as product_name,
        p.slug as product_slug
      FROM subscription_plans sp
      LEFT JOIN products p ON sp.product_id = p.id
      WHERE sp.id = ${planId}
    `

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    const items = await sql`
      SELECT 
        spi.*,
        p.name as product_name,
        p.slug as product_slug,
        p.base_price as product_price,
        p.nutritional_info,
        p.dietary_tags
      FROM subscription_plan_items spi
      LEFT JOIN products p ON spi.product_id = p.id
      WHERE spi.plan_id = ${planId}
      ORDER BY spi.sort_order, spi.id
    `

    return NextResponse.json({ plan, items })
  } catch (error) {
    console.error("Error fetching subscription plan:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const planId = Number.parseInt(params.id)
    const body = await request.json()
    const {
      name,
      description,
      billing_period,
      billing_interval,
      price,
      trial_period_days,
      delivery_frequency,
      items_per_delivery,
      is_active,
    } = body

    const [plan] = await sql`
      UPDATE subscription_plans SET
        name = ${name},
        description = ${description},
        billing_period = ${billing_period},
        billing_interval = ${billing_interval},
        price = ${price},
        trial_period_days = ${trial_period_days},
        delivery_frequency = ${delivery_frequency},
        items_per_delivery = ${items_per_delivery},
        is_active = ${is_active},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${planId}
      RETURNING *
    `

    return NextResponse.json({ plan })
  } catch (error) {
    console.error("Error updating subscription plan:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const planId = Number.parseInt(params.id)

    // Check if plan has active subscriptions
    const [activeCount] = await sql`
      SELECT COUNT(*) as count 
      FROM active_subscriptions 
      WHERE plan_id = ${planId} AND status = 'active'
    `

    if (Number.parseInt(activeCount.count) > 0) {
      return NextResponse.json({ error: "Cannot delete plan with active subscriptions" }, { status: 400 })
    }

    await sql`DELETE FROM subscription_plans WHERE id = ${planId}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting subscription plan:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
