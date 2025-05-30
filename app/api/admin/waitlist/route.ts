import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    // Use the existing session authentication system
    const user = await getSessionUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    // Ensure waitlist table exists
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        meal_plan_preference VARCHAR(100),
        city VARCHAR(100),
        notifications BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Get all waitlist submissions
    const submissions = await sql`
      SELECT * FROM waitlist 
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      submissions,
      count: submissions.length,
    })
  } catch (error) {
    console.error("Error fetching waitlist submissions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
