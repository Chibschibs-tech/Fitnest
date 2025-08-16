import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)

type OrderRow = {
  id: number
  user_id: number
  status: string | null
  plan_id: number | null
  meal_plan_id: number | null
  total_amount: number | null
  created_at: string | null
  plan_name?: string
  price_per_week?: number
}

type ExpressShopOrderRow = {
  id: number
  user_id: number
  total_amount: number | null
  status: string | null
  created_at: string | null
  order_type: string
}

/**
 * GET /api/user/dashboard
 * Returns dashboard data including subscriptions, orders, and stats
 */
export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "No session found" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      activeSubscriptions: [] as OrderRow[],
      orderHistory: [] as OrderRow[],
      expressShopOrders: [] as ExpressShopOrderRow[],
      upcomingDeliveries: [] as any[],
      stats: {
        totalOrders: 0,
        totalExpressShopOrders: 0,
        totalExpressShopSpent: 0,
      },
    }

    // Check if orders table exists and get meal plan orders
    const ordersReg = await sql`SELECT to_regclass('public.orders') AS regclass`
    if (ordersReg[0]?.regclass) {
      try {
        // Get all meal plan orders
        const mealPlanOrders = await sql<OrderRow[]>`
          SELECT 
            o.id, 
            o.user_id, 
            o.status, 
            o.plan_id,
            o.meal_plan_id,
            o.total_amount, 
            o.created_at,
            mp.name as plan_name,
            mp.price_per_week
          FROM orders o
          LEFT JOIN meal_plans mp ON (o.meal_plan_id = mp.id OR o.plan_id = mp.id)
          WHERE o.user_id = ${user.id}
          ORDER BY o.created_at DESC
        `

        payload.orderHistory = mealPlanOrders
        payload.stats.totalOrders = mealPlanOrders.length

        // Filter active subscriptions (orders with meal plans that are active/paused)
        const isActive = (status: string | null | undefined) => {
          const s = (status ?? "").toLowerCase()
          return s === "active" || s === "paused" || s === "confirmed" || s === "pending"
        }

        payload.activeSubscriptions = mealPlanOrders.filter(
          (o) => (o.meal_plan_id !== null || o.plan_id !== null) && isActive(o.status),
        )
      } catch (error) {
        console.error("Error fetching meal plan orders:", error)
      }
    }

    // Check if express_shop_orders table exists
    try {
      const expressShopReg = await sql`SELECT to_regclass('public.express_shop_orders') AS regclass`
      if (expressShopReg[0]?.regclass) {
        const expressShopOrders = await sql<ExpressShopOrderRow[]>`
          SELECT 
            id, 
            user_id,
            total_amount, 
            status, 
            created_at,
            'express_shop' as order_type
          FROM express_shop_orders
          WHERE user_id = ${user.id}
          ORDER BY created_at DESC
          LIMIT 10
        `

        payload.expressShopOrders = expressShopOrders

        // Calculate express shop stats
        const totalExpressShopOrders = expressShopOrders.length
        const totalExpressShopSpent = expressShopOrders.reduce((sum, order) => {
          const amount = Number(order.total_amount || 0)
          // Convert from cents if amount is large (>= 1000)
          const normalizedAmount = amount >= 1000 ? amount / 100 : amount
          return sum + normalizedAmount
        }, 0)

        payload.stats.totalExpressShopOrders = totalExpressShopOrders
        payload.stats.totalExpressShopSpent = totalExpressShopSpent
      }
    } catch (error) {
      console.error("Error fetching express shop orders:", error)
    }

    // Check for upcoming deliveries
    try {
      const deliveryReg = await sql`SELECT to_regclass('public.delivery_status') AS regclass`
      if (deliveryReg[0]?.regclass) {
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

        payload.upcomingDeliveries = upcomingDeliveries
      }
    } catch (error) {
      console.error("Error fetching upcoming deliveries:", error)
    }

    // Return both flat payload and legacy envelope for backward compatibility
    return NextResponse.json({
      status: "success",
      data: payload,
      ...payload,
    })
  } catch (error) {
    console.error("Error fetching user dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
