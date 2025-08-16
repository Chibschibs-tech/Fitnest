import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // First, ensure the waitlist table exists
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active'
      )
    `

    const waitlist = await sql`
      SELECT 
        id,
        email,
        name,
        created_at,
        status
      FROM waitlist
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      waitlist: waitlist || [],
    })
  } catch (error) {
    console.error("Error fetching waitlist:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch waitlist" }, { status: 500 })
  }
}
