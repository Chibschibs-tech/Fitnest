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

    // Ensure users table exists with sample data
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20),
          password_hash VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Check if we have any users (excluding admin)
      const userCount = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'user'`

      if (userCount[0].count === 0) {
        // Create some sample customers
        await sql`
          INSERT INTO users (name, email, phone, role)
          VALUES 
            ('Ahmed Hassan', 'ahmed.hassan@example.com', '+212 6 12 34 56 78', 'user'),
            ('Fatima Zahra', 'fatima.zahra@example.com', '+212 6 87 65 43 21', 'user'),
            ('Omar Benali', 'omar.benali@example.com', '+212 6 11 22 33 44', 'user'),
            ('Aicha Alami', 'aicha.alami@example.com', '+212 6 55 66 77 88', 'user'),
            ('Youssef Tazi', 'youssef.tazi@example.com', '+212 6 99 88 77 66', 'user'),
            ('Khadija Idrissi', 'khadija.idrissi@example.com', '+212 6 44 33 22 11', 'user'),
            ('Mohammed Berrada', 'mohammed.berrada@example.com', '+212 6 77 88 99 00', 'user'),
            ('Laila Fassi', 'laila.fassi@example.com', '+212 6 33 44 55 66', 'user')
        `
      }
    } catch (tableError) {
      console.error("Error with users table:", tableError)
    }

    // Get customers with their order statistics
    const customers = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.created_at,
        COALESCE(order_stats.total_orders, 0) as total_orders,
        COALESCE(order_stats.active_subscriptions, 0) as active_subscriptions,
        COALESCE(order_stats.total_spent, 0) as total_spent,
        order_stats.last_order_date,
        CASE 
          WHEN order_stats.active_subscriptions > 0 THEN 'active'
          WHEN order_stats.total_orders > 0 THEN 'inactive'
          ELSE 'inactive'
        END as status
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id,
          COUNT(*) as total_orders,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_subscriptions,
          SUM(total_amount) as total_spent,
          MAX(created_at) as last_order_date
        FROM orders
        GROUP BY user_id
      ) order_stats ON u.id = order_stats.user_id
      WHERE u.role = 'user'
      ORDER BY u.created_at DESC
    `

    return NextResponse.json({
      success: true,
      customers: customers || [],
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
