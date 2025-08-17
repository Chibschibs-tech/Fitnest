import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const customerId = Number.parseInt(params.id)
    if (isNaN(customerId)) {
      return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 })
    }

    console.log("Fetching customer details for ID:", customerId)

    // Get customer details
    const customers = await sql`
      SELECT 
        id, 
        name, 
        email, 
        role, 
        acquisition_source,
        created_at,
        updated_at
      FROM users 
      WHERE id = ${customerId} AND role != 'admin'
    `

    if (customers.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = customers[0]

    // Get customer orders with error handling
    let orders = []
    try {
      // Check what columns exist in orders table
      const orderColumns = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'orders' AND table_schema = 'public'
      `
      console.log(
        "Available order columns:",
        orderColumns.map((c) => c.column_name),
      )

      // Use only existing columns
      orders = await sql`
        SELECT 
          id,
          user_id,
          status,
          COALESCE(total_amount, total, 0)::numeric as total,
          created_at,
          updated_at
        FROM orders 
        WHERE user_id = ${customerId}
        ORDER BY created_at DESC
      `
      console.log(`Found ${orders.length} orders for customer ${customerId}`)
    } catch (orderError) {
      console.log("Error fetching orders:", orderError)
      orders = []
    }

    // Get meal preferences
    let mealPreferences = null
    try {
      const preferences = await sql`
        SELECT * FROM meal_preferences 
        WHERE user_id = ${customerId}
      `
      mealPreferences = preferences[0] || null
    } catch (prefError) {
      console.log("No meal preferences table or data")
    }

    // Get notification preferences
    let notificationPreferences = null
    try {
      const notifications = await sql`
        SELECT * FROM notification_preferences 
        WHERE user_id = ${customerId}
      `
      notificationPreferences = notifications[0] || null
    } catch (notifError) {
      console.log("No notification preferences table or data")
    }

    // Calculate customer stats
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + (Number.parseFloat(order.total) || 0), 0)
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
    const lastOrderDate = orders.length > 0 ? orders[0].created_at : null

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        totalOrders,
        totalSpent,
        averageOrderValue,
        lastOrderDate,
        orders: orders.slice(0, 10), // Return first 10 orders
        mealPreferences,
        notificationPreferences,
      },
    })
  } catch (error) {
    console.error("Error fetching customer details:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customer details",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
