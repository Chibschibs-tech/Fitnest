import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if cart_items table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'cart_items'
      );
    `

    if (!tableExists[0].exists) {
      // Create the cart_items table
      await sql`
        CREATE TABLE cart_items (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `

      return NextResponse.json({
        message: "Cart items table created successfully",
        tableCreated: true,
      })
    }

    // Check the table structure
    const tableStructure = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'cart_items'
      ORDER BY ordinal_position
    `

    return NextResponse.json({
      message: "Cart items table already exists",
      tableCreated: false,
      tableStructure,
    })
  } catch (error) {
    console.error("Error initializing cart_items table:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize cart_items table",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
