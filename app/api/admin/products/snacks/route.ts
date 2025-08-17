import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create snacks table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS snacks (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category TEXT NOT NULL,
        stock INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Check if we have any snacks
    const existingSnacks = await sql`SELECT COUNT(*) as count FROM snacks`
    const snackCount = existingSnacks[0]?.count || 0

    // If no snacks exist, create sample data
    if (snackCount === 0) {
      await sql`
        INSERT INTO snacks (name, description, price, category, stock, active)
        VALUES 
        ('Protein Bar - Chocolate', 'High-protein bar with chocolate flavor', 25.00, 'Protein Bars', 50, true),
        ('Protein Bar - Vanilla', 'High-protein bar with vanilla flavor', 25.00, 'Protein Bars', 45, true),
        ('Whey Protein Powder', 'Premium whey protein powder for muscle building', 299.00, 'Supplements', 20, true),
        ('Mixed Nuts', 'Healthy mix of almonds, walnuts, and cashews', 45.00, 'Healthy Snacks', 30, true),
        ('Energy Balls', 'Homemade energy balls with dates and nuts', 35.00, 'Healthy Snacks', 25, true)
      `
    }

    // Fetch all snacks
    const snacks = await sql`
      SELECT * FROM snacks 
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      snacks: snacks,
    })
  } catch (error) {
    console.error("Error fetching snacks:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch snacks",
        snacks: [],
      },
      { status: 500 },
    )
  }
}
