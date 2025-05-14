import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if cart_items table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const cartTableExists = tables.some((t) => t.table_name === "cart_items")

    if (cartTableExists) {
      return NextResponse.json({
        success: true,
        message: "Cart table already exists",
        exists: true,
      })
    }

    // Create cart_items table if it doesn't exist
    await sql`
      CREATE TABLE cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    return NextResponse.json({
      success: true,
      message: "Cart table created successfully",
      exists: false,
    })
  } catch (error) {
    console.error("Error checking/creating cart table:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check/create cart table",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
