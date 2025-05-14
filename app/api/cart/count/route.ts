import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET() {
  try {
    // Get user session
    const session = await getServerSession(authOptions)

    // If not authenticated, return 0
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 })
    }

    const userId = session.user.id

    // Initialize Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Ensure cart table exists
    await sql`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Get cart count
    const result = await sql`
      SELECT SUM(quantity) as count
      FROM cart_items
      WHERE user_id = ${userId}
    `

    const count = result[0]?.count || 0

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching cart count:", error)
    return NextResponse.json({ count: 0 })
  }
}
