import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
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

    // Create deliveries table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS deliveries (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        delivery_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        total_amount DECIMAL(10,2) DEFAULT 0,
        week_number INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if we have any deliveries, if not create some sample data
    const existingDeliveries = await sql`SELECT COUNT(*) as count FROM deliveries`

    if (existingDeliveries[0].count === 0) {
      // Create sample deliveries from orders
      await sql`
        INSERT INTO deliveries (order_id, customer_name, customer_email, delivery_date, status, total_amount, week_number)
        SELECT 
          o.id,
          o.customer_name,
          o.customer_email,
          CURRENT_DATE + INTERVAL '1 day' * (RANDOM() * 7)::INTEGER,
          'pending',
          o.total_amount,
          1
        FROM orders o
        WHERE o.status = 'active'
        LIMIT 10
      `
    }

    // Fetch all deliveries
    const deliveries = await sql`
      SELECT 
        d.id,
        d.order_id,
        d.customer_name,
        d.customer_email,
        d.delivery_date,
        d.status,
        d.total_amount,
        d.week_number
      FROM deliveries d
      ORDER BY d.delivery_date ASC
    `

    return NextResponse.json({
      success: true,
      deliveries: deliveries || [],
    })
  } catch (error) {
    console.error("Error fetching deliveries:", error)
    return NextResponse.json({ error: "Failed to fetch deliveries" }, { status: 500 })
  }
}
