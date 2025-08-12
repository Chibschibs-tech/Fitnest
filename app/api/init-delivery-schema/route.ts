import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("Initializing delivery schema...")

    // Add pause-related columns to orders table
    await sql`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS pause_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS paused_at TIMESTAMP NULL,
      ADD COLUMN IF NOT EXISTS pause_duration_days INTEGER NULL,
      ADD COLUMN IF NOT EXISTS original_end_date DATE NULL,
      ADD COLUMN IF NOT EXISTS extended_end_date DATE NULL,
      ADD COLUMN IF NOT EXISTS delivery_frequency VARCHAR(20) DEFAULT 'weekly',
      ADD COLUMN IF NOT EXISTS delivery_days TEXT DEFAULT 'monday,tuesday,wednesday,thursday,friday'
    `

    // Create deliveries table
    await sql`
      CREATE TABLE IF NOT EXISTS deliveries (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        scheduled_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        delivered_at TIMESTAMP NULL,
        notes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries(order_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_deliveries_scheduled_date ON deliveries(scheduled_date)`
    await sql`CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status)`

    console.log("Delivery schema initialized successfully")

    return NextResponse.json({
      success: true,
      message: "Delivery schema initialized successfully",
    })
  } catch (error) {
    console.error("Error initializing delivery schema:", error)
    return NextResponse.json({ error: "Failed to initialize delivery schema", details: error }, { status: 500 })
  }
}
