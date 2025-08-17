import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customerId = params.id

    // Get customer details
    const customerResult = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.address,
        u.created_at,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(
          CASE 
            WHEN o.total IS NOT NULL THEN o.total
            WHEN o.total_amount IS NOT NULL THEN o.total_amount
            ELSE 0
          END
        ), 0) as total_spent,
        MAX(o.created_at) as last_order_date,
        CASE 
          WHEN COUNT(DISTINCT o.id) > 0 THEN 'active'
          ELSE 'inactive'
        END as status
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'cancelled'
      WHERE u.id = ${customerId}
      GROUP BY u.id, u.name, u.email, u.phone, u.address, u.created_at
    `

    if (customerResult.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = customerResult[0]

    // Get customer's orders
    const orders = await sql`
      SELECT 
        id,
        status,
        CASE 
          WHEN total IS NOT NULL THEN total
          WHEN total_amount IS NOT NULL THEN total_amount
          ELSE 0
        END as total,
        created_at,
        order_type,
        meal_plan_id
      FROM orders
      WHERE user_id = ${customerId}
      ORDER BY created_at DESC
      LIMIT 20
    `

    // Get customer's meal plans/subscriptions if any
    const subscriptions = await sql`
      SELECT DISTINCT
        mp.id,
        mp.name,
        mp.price_per_week,
        o.status as subscription_status,
        o.created_at as start_date
      FROM orders o
      LEFT JOIN meal_plans mp ON o.meal_plan_id = mp.id
      WHERE o.user_id = ${customerId}
      AND o.order_type = 'subscription'
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        created_at: customer.created_at,
        total_orders: Number(customer.total_orders),
        total_spent: Number(customer.total_spent),
        last_order_date: customer.last_order_date,
        status: customer.status,
      },
      orders: orders,
      subscriptions: subscriptions,
    })
  } catch (error) {
    console.error("Error fetching customer details:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch customer details",
    })
  }
}
