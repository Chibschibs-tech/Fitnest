import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

// Ensure dynamic so the user sees their latest data
export const dynamic = "force-dynamic"

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
if (!DATABASE_URL) {
  console.warn("[/api/user/subscriptions] Missing DATABASE_URL or NEON_DATABASE_URL env")
}
const sql = DATABASE_URL
  ? neon(DATABASE_URL)
  : ((async () => {
      throw new Error("No database URL configured")
    }) as any)

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    console.log("[/api/user/subscriptions] Session ID:", sessionId ? "present" : "missing")

    if (!sessionId) {
      console.log("[/api/user/subscriptions] No session ID found")
      return NextResponse.json({ error: "Not authenticated", subscriptions: [] }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    console.log("[/api/user/subscriptions] User:", user ? `ID ${user.id}` : "not found")

    if (!user) {
      console.log("[/api/user/subscriptions] Invalid session")
      return NextResponse.json({ error: "Invalid session", subscriptions: [] }, { status: 401 })
    }

    // Verify orders table existence
    let ordersExists = false
    try {
      const r = await sql`SELECT to_regclass('public.orders') AS regclass`
      ordersExists = Boolean(r?.[0]?.regclass)
      console.log("[/api/user/subscriptions] Orders table exists:", ordersExists)
    } catch (err) {
      console.log("[/api/user/subscriptions] Error checking orders table:", err)
      ordersExists = false
    }

    if (!ordersExists) {
      console.log("[/api/user/subscriptions] Orders table doesn't exist, returning empty array")
      return NextResponse.json({ success: true, subscriptions: [] }, { status: 200 })
    }

    // Prefer join with meal_plans for name; fall back if table not present.
    let rows: any[] = []
    let joined = true
    try {
      const reg = await sql`SELECT to_regclass('public.meal_plans') AS regclass`
      if (!reg?.[0]?.regclass) throw new Error("meal_plans missing")
      rows = await sql`
        SELECT 
          o.id, o.user_id, o.status, o.plan_id, o.total_amount, o.created_at,
          mp.name AS plan_name
        FROM orders o
        LEFT JOIN meal_plans mp ON o.plan_id = mp.id
        WHERE o.user_id = ${user.id} AND o.plan_id IS NOT NULL
        ORDER BY o.created_at DESC
      `
      console.log("[/api/user/subscriptions] Found orders with meal plans:", rows.length)
    } catch (err) {
      console.log("[/api/user/subscriptions] Meal plans join failed, using orders only:", err)
      joined = false
      try {
        rows = await sql`
          SELECT id, user_id, status, plan_id, total_amount, created_at
          FROM orders
          WHERE user_id = ${user.id} AND plan_id IS NOT NULL
          ORDER BY created_at DESC
        `
        console.log("[/api/user/subscriptions] Found orders without meal plans:", rows.length)
      } catch (orderErr) {
        console.log("[/api/user/subscriptions] Error fetching orders:", orderErr)
        return NextResponse.json({ success: true, subscriptions: [] }, { status: 200 })
      }
    }

    const subscriptions = rows.map((r) => ({
      id: Number(r.id),
      status: r.status ?? "pending",
      planId: r.plan_id ?? null,
      planName: joined ? (r.plan_name ?? null) : null,
      totalAmount: r.total_amount ?? null,
      createdAt: r.created_at ? String(r.created_at) : null,
    }))

    console.log("[/api/user/subscriptions] Returning subscriptions:", subscriptions.length)
    return NextResponse.json({ success: true, subscriptions })
  } catch (err) {
    console.error("GET /api/user/subscriptions error:", err)
    // Return empty list instead of throwing to keep client UI stable
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch subscriptions",
        subscriptions: [],
      },
      { status: 200 },
    )
  }
}
