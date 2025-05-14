import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Helper function to ensure cart table exists
async function ensureCartTableExists() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if cart_items table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const cartTableExists = tables.some((t) => t.table_name === "cart_items")

    if (!cartTableExists) {
      console.log("Creating cart_items table for count...")
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
      console.log("cart_items table created successfully")
    }
    return true
  } catch (error) {
    console.error("Error checking/creating cart table:", error)
    return false
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const sql = neon(process.env.DATABASE_URL!)

    // Ensure cart table exists
    await ensureCartTableExists()

    // Count cart items for the user
    const result = await sql`
      SELECT SUM(quantity) as count
      FROM cart_items
      WHERE user_id = ${userId}
    `

    const count = Number(result[0]?.count || 0)

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching cart count:", error)
    return NextResponse.json({
      count: 0,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
