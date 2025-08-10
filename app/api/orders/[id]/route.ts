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
 * Normalizes "amount" that might be stored in MAD or cents.
 * If >= 1000, assume cents and convert to MAD.
 */
function normalizeAmount(amount: number | null | undefined): number {
  if (!amount) return 0
  return amount >= 1000 ? Math.round(amount) / 100 : amount
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
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

    const id = Number(params.id)
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 })
    }

    const reg = await sql`SELECT to_regclass('public.orders') AS regclass`
    if (!reg[0]?.regclass) {
      return NextResponse.json({ error: "Orders table not available" }, { status: 404 })
    }

    const rows = await sql<OrderRow[]>`
      SELECT id, user_id, status, plan_id, total_amount, created_at
      FROM orders
      WHERE id = ${id} AND user_id = ${user.id}
      LIMIT 1
    `
    const row = rows[0]
    if (!row) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const total = normalizeAmount(row.total_amount)
    const isPlan = row.plan_id !== null

    // Construct a simple, consistent object for the client UI.
    const order = {
      id: row.id,
      date: row.created_at ?? new Date().toISOString(),
      status: (row.status ?? "pending").toLowerCase(),
      type: isPlan ? "meal_plan" : "order",
      customer: {
        // We don't query a users table here; use session user safely.
        name: user.name ?? "Customer",
        email: user.email ?? "",
        phone: "",
      },
      shipping: {
        address: "",
        city: "",
        postalCode: "",
        deliveryDate: row.created_at ?? new Date().toISOString(),
      },
      payment: {
        method: "Cash on Delivery",
        status: row.status && row.status.toLowerCase() === "completed" ? "Paid" : "Unpaid",
      },
      items: isPlan
        ? [
            {
              id: row.plan_id!,
              type: "meal_plan",
              name: `Meal Plan`,
              details: `Plan ${row.plan_id}`,
              price: total,
              imageUrl: "/vibrant-weight-loss-meal.png",
            },
          ]
        : [],
      subtotal: total,
      shipping: 0,
      total,
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error in GET /api/orders/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
