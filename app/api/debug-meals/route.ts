import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if meals table exists and get count
    const count = await sql`SELECT COUNT(*) as count FROM meals`

    // Get first 5 meals to see the data
    const sampleMeals = await sql`
      SELECT id, name, description, calories, protein, carbs, fat, "imageUrl", category, "createdAt"
      FROM meals
      ORDER BY "createdAt" DESC
      LIMIT 5
    `

    return NextResponse.json({
      success: true,
      totalMeals: count[0].count,
      sampleMeals,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug meals error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
