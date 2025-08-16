import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)

/**
 * GET /api/user/dashboard
 * Returns dashboard data including subscriptions, orders, and stats
 */
export async function GET() {
  try {
    console.log("Dashboard API called")

    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    console.log("Session ID from cookie:", sessionId)

    if (!sessionId) {
      console.log("No session ID found")
      return NextResponse.json({ error: "No session found" }, { status: 401 })
    }

    // Get user from session - check what session system is actually being used
    let user = null

    // Try the sessions table approach
    try {
      const sessionResult = await sql`
        SELECT u.id, u.name, u.email, u.role 
        FROM users u
        JOIN sessions s ON u.id = s.user_id
        WHERE s.id = ${sessionId} AND s.expires_at > NOW()
      `

      console.log("Session query result:", sessionResult)

      if (sessionResult.length > 0) {
        user = sessionResult[0]
      }
    } catch (sessionError) {
      console.log("Sessions table query failed:", sessionError)
    }

    // If sessions table doesn't work, try direct user lookup (fallback)
    if (!user) {
      try {
        const userResult = await sql`
          SELECT id, name, email, role 
          FROM users 
          WHERE id = ${Number.parseInt(sessionId)}
        `

        console.log("Direct user query result:", userResult)

        if (userResult.length > 0) {
          user = userResult[0]
        }
      } catch (userError) {
        console.log("Direct user query failed:", userError)
      }
    }

    if (!user) {
      console.log("No user found for session")
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    console.log("Found user:", user)

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      activeSubscriptions: [],
      orderHistory: [],
      expressShopOrders: [],
      upcomingDeliveries: [],
      stats: {
        totalOrders: 0,
        totalExpressShopOrders: 0,
        totalExpressShopSpent: 0,
      },
    }

    // Check what tables exist
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('orders', 'meal_plans', 'express_shop_orders', 'delivery_status')
    `

    console.log("Available tables:", tableCheck)

    // Get meal plan orders if orders table exists
    const hasOrdersTable = tableCheck.some((t) => t.table_name === "orders")
    const hasMealPlansTable = tableCheck.some((t) => t.table_name === "meal_plans")

    if (hasOrdersTable) {
      try {
        let mealPlanOrders = []

        if (hasMealPlansTable) {
          // Try with meal_plans join
          mealPlanOrders = await sql`
            SELECT 
              o.id, 
              o.user_id, 
              o.status, 
              o.total as total_amount,
              o.created_at,
              mp.name as plan_name
            FROM orders o
            LEFT JOIN meal_plans mp ON o.plan_id = mp.id
            WHERE o.user_id = ${user.id}
            ORDER BY o.created_at DESC
          `
        } else {
          // Try without meal_plans join
          mealPlanOrders = await sql`
            SELECT 
              o.id, 
              o.user_id, 
              o.status, 
              o.total as total_amount,
              o.created_at
            FROM orders o
            WHERE o.user_id = ${user.id}
            ORDER BY o.created_at DESC
          `
        }

        console.log("Meal plan orders found:", mealPlanOrders)

        payload.orderHistory = mealPlanOrders
        payload.stats.totalOrders = mealPlanOrders.length

        // Filter active subscriptions
        const isActive = (status) => {
          const s = (status ?? "").toLowerCase()
          return s === "active" || s === "paused" || s === "confirmed" || s === "pending"
        }

        payload.activeSubscriptions = mealPlanOrders.filter((o) => isActive(o.status))

        console.log("Active subscriptions:", payload.activeSubscriptions)
      } catch (error) {
        console.error("Error fetching meal plan orders:", error)
      }
    }

    // Check for express shop orders
    const hasExpressShopTable = tableCheck.some((t) => t.table_name === "express_shop_orders")

    if (hasExpressShopTable) {
      try {
        const expressShopOrders = await sql`
          SELECT 
            id, 
            user_id,
            total_amount, 
            status, 
            created_at
          FROM express_shop_orders
          WHERE user_id = ${user.id}
          ORDER BY created_at DESC
          LIMIT 10
        `

        console.log("Express shop orders found:", expressShopOrders)

        payload.expressShopOrders = expressShopOrders.map((order) => ({
          ...order,
          order_type: "express_shop",
        }))

        payload.stats.totalExpressShopOrders = expressShopOrders.length
        payload.stats.totalExpressShopSpent = expressShopOrders.reduce((sum, order) => {
          const amount = Number(order.total_amount || 0)
          return sum + (amount >= 1000 ? amount / 100 : amount)
        }, 0)
      } catch (error) {
        console.error("Error fetching express shop orders:", error)
      }
    }

    // Check for upcoming deliveries
    const hasDeliveryTable = tableCheck.some((t) => t.table_name === "delivery_status")

    if (hasDeliveryTable) {
      try {
        const upcomingDeliveries = await sql`
          SELECT 
            ds.delivery_date,
            ds.status,
            o.id as order_id
          FROM delivery_status ds
          JOIN orders o ON ds.order_id = o.id
          WHERE o.user_id = ${user.id}
          AND ds.status = 'pending'
          AND ds.delivery_date >= CURRENT_DATE
          ORDER BY ds.delivery_date ASC
          LIMIT 5
        `

        console.log("Upcoming deliveries found:", upcomingDeliveries)
        payload.upcomingDeliveries = upcomingDeliveries
      } catch (error) {
        console.error("Error fetching upcoming deliveries:", error)
      }
    }

    console.log("Final payload:", payload)

    return NextResponse.json({
      status: "success",
      data: payload,
      ...payload,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
