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
    if (isNaN(planId)) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 })
    }

    // Get subscription plan with items
    const plan = await sql`
      SELECT 
        sp.*,
        p.name as product_name,
        p.slug as product_slug,
        p.featured_image
      FROM subscription_plans sp
      LEFT JOIN products p ON sp.product_id = p.id
      WHERE sp.id = ${planId}
    `

    if (plan.length === 0) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Get plan items
    const items = await sql`
      SELECT 
        spi.*,
        p.name as product_name,
        p.base_price,
        p.featured_image
      FROM subscription_plan_items spi
      LEFT JOIN products p ON spi.product_id = p.id
      WHERE spi.plan_id = ${planId}
      ORDER BY spi.sort_order, spi.id
    `

    return NextResponse.json({
      success: true,
      plan: {
        ...plan[0],
        price: Number.parseFloat(plan[0].price || 0),
        items: items.map((item) => ({
          ...item,
          additional_price: Number.parseFloat(item.additional_price || 0),
          base_price: Number.parseFloat(item.base_price || 0),
        })),
      },
    })
  } catch (error) {
    console.error("Get subscription plan error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
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
    if (isNaN(planId)) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 })
    }

    const body = await request.json()
    const {
      name,
      description,
      billing_period,
      price,
      trial_period_days,
      delivery_frequency,
      items_per_delivery,
      is_active,
    } = body

    // Update the subscription plan
    const result = await sql`
      UPDATE subscription_plans SET
        name = ${name},
        description = ${description || ""},
        billing_period = ${billing_period || "weekly"},
        price = ${price},
        trial_period_days = ${trial_period_days || 0},
        delivery_frequency = ${delivery_frequency || "weekly"},
        items_per_delivery = ${items_per_delivery || 1},
        is_active = ${is_active !== undefined ? is_active : true},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${planId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      plan: {
        ...result[0],
        price: Number.parseFloat(result[0].price),
      },
    })
  } catch (error) {
    console.error("Update subscription plan error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
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
    if (isNaN(planId)) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 })
    }

    // Check if plan has active subscriptions
    const activeSubscriptions = await sql`
      SELECT COUNT(*) as count 
      FROM active_subscriptions 
      WHERE plan_id = ${planId} AND status = 'active'
    `

    if (Number.parseInt(activeSubscriptions[0].count) > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete plan with active subscriptions. Please cancel all subscriptions first.",
        },
        { status: 409 },
      )
    }

    // Delete the plan (cascade will handle plan items)
    const result = await sql`
      DELETE FROM subscription_plans 
      WHERE id = ${planId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Subscription plan deleted successfully",
    })
  } catch (error) {
    console.error("Delete subscription plan error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
