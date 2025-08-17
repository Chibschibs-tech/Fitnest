import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
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

    const sql = neon(process.env.DATABASE_URL!)

    // Get customers with their order statistics
    const customers = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.role,
        u.acquisition_source as "acquisitionSource",
        u.created_at as "createdAt",
        COUNT(DISTINCT o.id) as "totalOrders",
        COUNT(DISTINCT CASE WHEN o.status = 'active' THEN o.id END) as "activeOrders",
        COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total END), 0) as "totalSpent",
        MAX(o.created_at) as "lastOrderDate"
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'user'
      GROUP BY u.id, u.name, u.email, u.phone, u.role, u.acquisition_source, u.created_at
      ORDER BY u.created_at DESC
    `

    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
