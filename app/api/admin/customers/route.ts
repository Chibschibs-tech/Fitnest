import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    console.log("Fetching customers for admin...")

    // First, check if users table exists and get its structure
    let customers = []

    try {
      // Try to get customers with order statistics
      const customersQuery = await sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.phone,
          u.created_at,
          COALESCE(COUNT(DISTINCT o.id), 0) as total_orders,
          COALESCE(SUM(CASE WHEN o.total_amount IS NOT NULL THEN o.total_amount ELSE o.total END), 0) as total_spent,
          MAX(o.created_at) as last_order_date
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.role != 'admin' OR u.role IS NULL
        GROUP BY u.id, u.name, u.email, u.phone, u.created_at
        ORDER BY u.created_at DESC
      `

      customers = customersQuery
    } catch (orderJoinError) {
      console.log("Order join failed, trying simple users query:", orderJoinError)

      // Fallback: just get users without order data
      try {
        const simpleUsersQuery = await sql`
          SELECT 
            id,
            name,
            email,
            phone,
            created_at
          FROM users
          WHERE role != 'admin' OR role IS NULL
          ORDER BY created_at DESC
        `

        customers = simpleUsersQuery.map((user) => ({
          ...user,
          total_orders: 0,
          total_spent: 0,
          last_order_date: null,
        }))
      } catch (simpleError) {
        console.log("Simple users query failed:", simpleError)
        customers = []
      }
    }

    // Transform the data to ensure proper types
    const transformedCustomers = customers.map((customer) => ({
      id: Number(customer.id),
      name: customer.name || "Unknown User",
      email: customer.email || "",
      phone: customer.phone || null,
      address: customer.address || null,
      created_at: customer.created_at,
      total_orders: Number(customer.total_orders) || 0,
      total_spent: Number(customer.total_spent) || 0,
      last_order_date: customer.last_order_date || null,
      status: (Number(customer.total_orders) > 0 ? "active" : "inactive") as "active" | "inactive",
    }))

    console.log(`Found ${transformedCustomers.length} customers`)

    return NextResponse.json({
      success: true,
      customers: transformedCustomers,
      total: transformedCustomers.length,
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customers",
        error: error instanceof Error ? error.message : "Unknown error",
        customers: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
