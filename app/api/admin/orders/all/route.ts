import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"

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

    const sql = neon(process.env.DATABASE_URL!)

    // Ensure orders table exists
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER,
          customer_name VARCHAR(255),
          customer_email VARCHAR(255),
          plan_name VARCHAR(255),
          total_amount DECIMAL(10,2) DEFAULT 0,
          status VARCHAR(50) DEFAULT 'pending',
          delivery_frequency VARCHAR(50),
          duration_weeks INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Add some sample order data if none exists
      const orderCount = await sql`SELECT COUNT(*) as count FROM orders`

      if (orderCount[0].count === 0) {
        await sql`
          INSERT INTO orders (customer_name, customer_email, plan_name, total_amount, status, delivery_frequency, duration_weeks)
          VALUES 
            ('Ahmed Hassan', 'ahmed.hassan@example.com', 'Weight Loss Plan', 299.99, 'delivered', 'weekly', 4),
            ('Fatima Zahra', 'fatima.zahra@example.com', 'Muscle Gain Plan', 349.99, 'preparing', 'weekly', 8),
            ('Omar Benali', 'omar.benali@example.com', 'Keto Plan', 279.99, 'confirmed', 'weekly', 6),
            ('Aicha Alami', 'aicha.alami@example.com', 'Balanced Plan', 259.99, 'pending', 'weekly', 4),
            ('Youssef Tazi', 'youssef.tazi@example.com', 'Express Meal', 45.99, 'delivered', NULL, NULL),
            ('Khadija Idrissi', 'khadija.idrissi@example.com', 'Protein Snack Box', 29.99, 'confirmed', NULL, NULL)
        `
      }
    } catch (tableError) {
      console.error("Error with orders table:", tableError)
    }

    // Get all orders
    const orders = await sql`
      SELECT 
        o.id,
        o.customer_name,
        o.customer_email,
        o.plan_name,
        o.total_amount,
        o.status,
        o.delivery_frequency,
        o.duration_weeks,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({
      success: true,
      orders: orders || [],
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
