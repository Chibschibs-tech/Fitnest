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

    console.log(`Fetching customer details for ID: ${customerId}`)

    // Get customer basic info
    let customer
    try {
      const customerResult = await sql`
        SELECT 
          id,
          name,
          email,
          phone,
          address,
          created_at,
          role
        FROM users
        WHERE id = ${customerId}
      `

      if (customerResult.length === 0) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 })
      }

      customer = customerResult[0]
    } catch (error) {
      console.error("Error fetching customer:", error)
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Get customer orders
    let orders = []
    try {
      orders = await sql`
        SELECT 
          id,
          COALESCE(
            CASE 
              WHEN total IS NOT NULL THEN total
              WHEN total_amount IS NOT NULL THEN total_amount
              ELSE 0
            END, 
            0
          ) as total,
          status,
          created_at,
          meal_plan_id,
          order_type
        FROM orders
        WHERE user_id = ${customerId}
        ORDER BY created_at DESC
      `
    } catch (error) {
      console.log("Error fetching orders:", error)
      orders = []
    }

    // Calculate statistics
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
    const activeOrders = orders.filter((order) => order.status === "active").length
    const lastOrderDate = orders.length > 0 ? orders[0].created_at : null

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        totalOrders,
        totalSpent,
        activeOrders,
        lastOrderDate,
        status: totalOrders > 0 ? "active" : "inactive",
      },
      orders,
    })
  } catch (error) {
    console.error("Error fetching customer details:", error)
    return NextResponse.json({ error: "Failed to fetch customer details" }, { status: 500 })
  }
}
