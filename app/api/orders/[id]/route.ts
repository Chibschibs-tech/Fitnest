import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)

function normalizeAmount(amount: any): number {
  if (amount == null) return 0
  const n = Number(amount)
  if (!isFinite(n)) return 0
  // If values are stored in cents, convert to MAD
  return n >= 1000 ? Math.round(n) / 100 : n
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id

    // Ensure orders table exists
    const reg = await sql`SELECT to_regclass('public.orders') AS regclass`
    if (!reg[0]?.regclass) {
      return NextResponse.json({ message: "Orders table missing" }, { status: 404 })
    }

    // Try to join meal_plans for richer details, fallback otherwise
    let rows: any[] = []
    try {
      rows = await sql`
        SELECT o.*, mp.name AS plan_name, mp.description AS plan_description, mp.type AS plan_type
        FROM orders o
        LEFT JOIN meal_plans mp ON o.plan_id = mp.id
        WHERE o.id = ${orderId} AND o.user_id = ${user.id}
        LIMIT 1
      `
    } catch {
      rows = await sql`
        SELECT *
        FROM orders
        WHERE id = ${orderId} AND user_id = ${user.id}
        LIMIT 1
      `
    }

    if (rows.length === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    const order = rows[0]
    const total = normalizeAmount(order.total_amount)

    const isMealPlan = order.plan_id != null

    const transformedOrder = {
      id: order.id,
      date: order.created_at ?? new Date().toISOString(),
      status: (order.status || "pending").toLowerCase(),
      type: isMealPlan ? "meal_plan" : "order",
      customer: {
        name: user.name || user.email,
        email: user.email,
        phone: user.phone || "",
      },
      shipping: {
        address: order.delivery_address || "Address not provided",
        city: "Casablanca",
        postalCode: "20000",
        deliveryDate: order.delivery_date || order.created_at || new Date().toISOString(),
      },
      payment: {
        method: order.payment_method || "Cash on Delivery",
        status: order.payment_status || "Pending",
      },
      items: isMealPlan
        ? [
            {
              id: order.plan_id,
              type: "meal_plan",
              name: order.plan_name || "Meal Plan",
              details: order.plan_description || "Custom meal plan",
              price: total,
              imageUrl: "/vibrant-meal-prep.png",
            },
          ]
        : [],
      subtotal: total,
      shipping: 0,
      total,
    }

    return NextResponse.json({ order: transformedOrder })
  } catch (error) {
    console.error("Error fetching order details:", error)
    return NextResponse.json({ message: "Failed to load order details" }, { status: 500 })
  }
}
