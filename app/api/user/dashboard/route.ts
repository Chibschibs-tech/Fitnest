import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Get user from session
    const sessionResult = await sql`
      SELECT u.id, u.name, u.email, u.role 
      FROM users u
      JOIN sessions s ON u.id = s.user_id
      WHERE s.token = ${token} AND s.expires_at > NOW()
    `

    if (sessionResult.length === 0) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const user = sessionResult[0]

    // Get active subscriptions
    const activeSubscriptions = await sql`
      SELECT o.*, mp.name as plan_name, mp.price_per_week
      FROM orders o
      JOIN meal_plans mp ON o.meal_plan_id = mp.id
      WHERE o.user_id = ${user.id} 
      AND o.status IN ('active', 'paused')
      ORDER BY o.created_at DESC
    `

    // Get meal plan order history
    const mealPlanOrders = await sql`
      SELECT o.*, mp.name as plan_name
      FROM orders o
      JOIN meal_plans mp ON o.meal_plan_id = mp.id
      WHERE o.user_id = ${user.id}
      ORDER BY o.created_at DESC
      LIMIT 10
    `

    // Get express shop orders
    const expressShopOrders = await sql`
      SELECT id, total_amount, status, created_at, 'express_shop' as order_type
      FROM express_shop_orders
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get upcoming deliveries
    const upcomingDeliveries = await sql`
      SELECT ds.*, o.id as order_id
      FROM delivery_status ds
      JOIN orders o ON ds.order_id = o.id
      WHERE o.user_id = ${user.id}
      AND ds.status = 'pending'
      AND ds.delivery_date >= CURRENT_DATE
      ORDER BY ds.delivery_date ASC
      LIMIT 5
    `

    // Calculate express shop stats
    const expressShopStats = await sql`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_spent
      FROM express_shop_orders
      WHERE user_id = ${user.id}
    `

    const stats = {
      totalOrders: mealPlanOrders.length,
      totalExpressShopOrders: Number(expressShopStats[0]?.total_orders || 0),
      totalExpressShopSpent: Number(expressShopStats[0]?.total_spent || 0) / 100, // Convert from cents
    }

    return NextResponse.json({
      data: {
        user,
        activeSubscriptions,
        orderHistory: mealPlanOrders,
        expressShopOrders,
        upcomingDeliveries,
        stats,
      },
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
