import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { sql } from "@/lib/db"

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

    // Get all customers with their order statistics
    const customers = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.address,
        u.created_at,
        COALESCE(COUNT(o.id), 0) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        MAX(o.created_at) as last_order_date
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'user'
      GROUP BY u.id, u.name, u.email, u.phone, u.address, u.created_at
      ORDER BY u.created_at DESC
    `

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
        customers: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
