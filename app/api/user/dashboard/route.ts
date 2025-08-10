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
  total_amount: number | null
  created_at: string | null
}

/**
 * GET /api/user/dashboard
 * Returns a flat payload so the dashboard UI can read fields directly.
 * Also includes a legacy { status, data } envelope for backward compatibility.
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
      // derived from orders table
      subscriptions: [] as OrderRow[],
      activeSubscription: null as OrderRow | null,
      orderHistory: [] as OrderRow[],
      upcomingDeliveries: [] as any[], // keep empty until deliveries table is wired
      stats: {
        totalOrders: 0,
      },
    }

    // Check if orders table exists
    const ordersReg = await sql`SELECT to_regclass('public.orders') AS regclass`
    if (ordersReg[0]?.regclass) {
      // Prefer ordering by created_at; if column missing, fallback without ORDER BY.
      let orders: OrderRow[] = []
      try {
        orders = await sql<OrderRow[]>`
          SELECT id, user_id, status, plan_id, total_amount, created_at
          FROM orders
          WHERE user_id = ${user.id}
          ORDER BY created_at DESC
        `
      } catch {
        orders = await sql<OrderRow[]>`
          SELECT id, user_id, status, plan_id, total_amount, created_at
          FROM orders
          WHERE user_id = ${user.id}
        `
      }

      payload.orderHistory = orders
      payload.stats.totalOrders = orders.length

      // Treat any order with a plan_id as a subscription order
      const subscriptionOrders = orders.filter((o) => o.plan_id !== null)

      // Consider "active" anything not explicitly cancelled/failed.
      const isActive = (status: string | null | undefined) => {
        const s = (status ?? "").toLowerCase()
        return s !== "cancelled" && s !== "canceled" && s !== "failed"
      }

      payload.subscriptions = subscriptionOrders
      payload.activeSubscription = subscriptionOrders.find((o) => isActive(o.status)) ?? null
    }

    // Return flat payload and also legacy envelope
    return NextResponse.json({ status: "success", data: payload, ...payload })
  } catch (error) {
    console.error("Error fetching user dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
