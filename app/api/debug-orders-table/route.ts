import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check orders table structure
    const ordersColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders'
      ORDER BY ordinal_position
    `

    // Check order_items table structure
    const orderItemsColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'order_items'
      ORDER BY ordinal_position
    `

    // Check sample orders data
    const sampleOrders = await sql`SELECT * FROM orders LIMIT 3`

    return NextResponse.json({
      ordersColumns,
      orderItemsColumns,
      sampleOrders,
      message: "Check console for orders table structure",
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({
      error: "Debug failed",
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
