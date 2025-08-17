import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id

    // Check if user is authenticated and is admin
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`Fetching customer details for ID: ${customerId}`)

    // Get customer details
    const customerResult = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.address,
        u.created_at,
        u.role,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(
          CASE 
            WHEN o.total IS NOT NULL THEN o.total::numeric
            WHEN o.total_amount IS NOT NULL THEN o.total_amount::numeric
            ELSE 0
          END
        ), 0) as total_spent,
        MAX(o.created_at) as last_order_date,
        CASE 
          WHEN COUNT(DISTINCT o.id) > 0 THEN 'active'
          ELSE 'inactive'
        END as status
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND (o.status != 'cancelled' OR o.status IS NULL)
      WHERE u.id = ${customerId}
      GROUP BY u.id, u.name, u.email, u.phone, u.address, u.created_at, u.role
    `

    if (customerResult.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = customerResult[0]

    // Get customer's order history
    const orders = await sql`
      SELECT 
        id,
        total,
        total_amount,
        status,
        created_at,
        updated_at
      FROM orders
      WHERE user_id = ${customerId}
      ORDER BY created_at DESC
      LIMIT 50
    `

    // Format the response
    const customerData = {
      id: customer.id,
      name: customer.name || "Unknown",
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      created_at: customer.created_at,
      total_orders: Number(customer.total_orders),
      total_spent: Number(customer.total_spent),
      last_order_date: customer.last_order_date,
      status: customer.status,
      orders: orders.map((order) => ({
        id: order.id,
        total: Number(order.total || order.total_amount || 0),
        status: order.status || "completed",
        created_at: order.created_at,
        updated_at: order.updated_at,
      })),
    }

    return NextResponse.json({
      success: true,
      customer: customerData,
    })
  } catch (error) {
    console.error("Error fetching customer details:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch customer details",
    })
  }
}
