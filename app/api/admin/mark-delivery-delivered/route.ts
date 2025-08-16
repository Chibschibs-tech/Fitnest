import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { orderId, deliveryDates, status = "delivered" } = await request.json()

    if (!orderId || !deliveryDates || !Array.isArray(deliveryDates)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    console.log(`Marking deliveries for order ${orderId}:`, deliveryDates)

    // Check if delivery_status table exists, create if not
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS delivery_status (
          id SERIAL PRIMARY KEY,
          order_id INTEGER,
          delivery_date DATE,
          status VARCHAR(50) DEFAULT 'pending',
          delivered_at TIMESTAMP,
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(order_id, delivery_date)
        )
      `
    } catch (error) {
      console.log("Table creation error (may already exist):", error)
    }

    let updatedCount = 0

    // Update or insert delivery status for each date
    for (const deliveryDate of deliveryDates) {
      try {
        // Try to update existing record
        const updateResult = await sql`
          UPDATE delivery_status 
          SET status = ${status}, 
              delivered_at = ${status === "delivered" ? new Date().toISOString() : null}
          WHERE order_id = ${orderId} AND delivery_date = ${deliveryDate}
        `

        // If no rows were updated, insert new record
        if (updateResult.count === 0) {
          await sql`
            INSERT INTO delivery_status (order_id, delivery_date, status, delivered_at)
            VALUES (${orderId}, ${deliveryDate}, ${status}, ${status === "delivered" ? new Date().toISOString() : null})
            ON CONFLICT (order_id, delivery_date) 
            DO UPDATE SET 
              status = ${status},
              delivered_at = ${status === "delivered" ? new Date().toISOString() : null}
          `
        }

        updatedCount++
      } catch (error) {
        console.error(`Error updating delivery ${orderId}/${deliveryDate}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updatedCount} deliveries marked as ${status}`,
      updatedDeliveries: updatedCount,
    })
  } catch (error) {
    console.error("Error marking deliveries:", error)
    return NextResponse.json({ error: "Failed to update delivery status" }, { status: 500 })
  }
}
