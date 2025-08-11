import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)

/**
 * Returns the user's subscription-like orders: any order with plan_id,
 * joined with meal_plans if available for plan name.
 */
export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 401 })
    }
    const user = await getSessionUser(sessionId)
    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Check that orders table exists
    const ordersReg = await sql`SELECT to_regclass('public.orders') AS regclass`
    if (!ordersReg[0]?.regclass) {
      return NextResponse.json({ subscriptions: [] })
    }

    // Try with join to meal_plans for plan name; fallback without join
    let rows: any[] = []
    try {
      rows = await sql`
        SELECT o.id, o.user_id, o.status, o.plan_id, o.total_amount, o.created_at,
               mp.name AS plan_name
        FROM orders o
        LEFT JOIN meal_plans mp ON o.plan_id = mp.id
        WHERE o.user_id = ${user.id} AND o.plan_id IS NOT NULL
        ORDER BY o.created_at DESC
      `
    } catch {
      rows = await sql`
        SELECT id, user_id, status, plan_id, total_amount, created_at
        FROM orders
        WHERE user_id = ${user.id} AND plan_id IS NOT NULL
        ORDER BY created_at DESC
      `
    }

    const subscriptions = rows.map((r) => ({
      id: r.id as number,
      status: (r.status ?? "pending") as string | null,
      planId: (r.plan_id ?? null) as number | null,
      planName: (r.plan_name ?? null) as string | null,
      totalAmount: (r.total_amount ?? null) as number | null,
      createdAt: (r.created_at ?? null) as string | null,
    }))

    return NextResponse.json({ subscriptions })
  } catch (err) {
    console.error("GET /api/user/subscriptions error:", err)
    return NextResponse.json({ subscriptions: [] }, { status: 200 })
  }
}
