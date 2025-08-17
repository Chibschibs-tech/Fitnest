import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const customerId = params.id

    // Get customer details
    const customer = await sql`
      SELECT 
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users 
      WHERE id = ${customerId}
      AND role != 'admin'
    `

    if (customer.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Get customer orders
    const orders = await sql`
      SELECT 
        o.id,
        o.status,
        o.total,
        o.total_amount,
        o.created_at,
        o.order_type,
        mp.name as meal_plan_name
      FROM orders o
      LEFT JOIN meal_plans mp ON o.meal_plan_id = mp.id
      WHERE o.user_id = ${customerId}
      ORDER BY o.created_at DESC
    `

    // Get customer subscriptions
    const subscriptions = await sql`
      SELECT 
        o.id,
        o.status,
        o.total,
        o.total_amount,
        o.created_at,
        mp.name as plan_name,
        mp.weekly_price
      FROM orders o
      LEFT JOIN meal_plans mp ON o.meal_plan_id = mp.id
      WHERE o.user_id = ${customerId}
      AND (o.order_type = 'subscription' OR mp.id IS NOT NULL)
      ORDER BY o.created_at DESC
    `

    // Calculate stats
    const totalSpent = orders.reduce((sum, order) => {
      const amount = order.total || order.total_amount || 0
      return sum + Number(amount)
    }, 0)

    const customerData = {
      ...customer[0],
      orders: orders,
      subscriptions: subscriptions,
      stats: {
        totalOrders: orders.length,
        totalSpent: totalSpent,
        activeSubscriptions: subscriptions.filter((s) => s.status === "active" || s.status === "pending").length,
      },
    }

    return NextResponse.json({
      success: true,
      customer: customerData,
    })
  } catch (error) {
    console.error("Error fetching customer details:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customer details",
      },
      { status: 500 },
    )
  }
}
