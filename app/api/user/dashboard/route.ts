import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)

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

    // Payload we want to expose to the dashboard UI
    const payload: {
      user: { name: string; email: string }
      subscriptions: any[]
      activeSubscription: any | null
      orderHistory: any[]
      upcomingDeliveries: any[]
      stats: { totalOrders: number }
    } = {
      user: { name: user.name, email: user.email },
      subscriptions: [],
      activeSubscription: null,
      orderHistory: [],
      upcomingDeliveries: [],
      stats: { totalOrders: 0 },
    }

    // Try to fetch subscriptions if the table exists
    try {
      const reg = await sql`SELECT to_regclass('public.subscriptions') AS regclass`
      if (reg[0]?.regclass) {
        // Avoid assuming column names beyond id/user_id/status; SELECT * for maximum compatibility.
        // If you add/rename columns later, this will still work.
        const subs = await sql`SELECT * FROM subscriptions WHERE user_id = ${user.id}`
        payload.subscriptions = subs
        // Consider first non-canceled row "active" (or adapt to your exact status semantics)
        payload.activeSubscription = subs.find((s: any) => (s.status ?? "active") !== "canceled") ?? null
      }
    } catch (error: any) {
      console.log("Subscriptions lookup skipped:", error?.message || error)
    }

    // Try to fetch orders if the table exists
    try {
      // First attempt with ORDER BY created_at; if it fails, fallback without ordering.
      try {
        const orders = await sql`SELECT * FROM orders WHERE user_id = ${user.id} ORDER BY created_at DESC`
        payload.orderHistory = orders
        payload.stats.totalOrders = orders.length
      } catch {
        const orders = await sql`SELECT * FROM orders WHERE user_id = ${user.id}`
        payload.orderHistory = orders
        payload.stats.totalOrders = orders.length
      }
    } catch (error: any) {
      console.log("Orders lookup skipped:", error?.message || error)
    }

    // Return flat payload for the client, but also include legacy envelope for any older callers
    return NextResponse.json({ status: "success", data: payload, ...payload })
  } catch (error) {
    console.error("Error fetching user dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
