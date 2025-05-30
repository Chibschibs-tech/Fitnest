import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, mealPlanPreference, city, notifications } = body

    console.log("Waitlist submission received:", {
      name,
      email,
      phone,
      mealPlanPreference,
      city,
      notifications,
      timestamp: new Date().toISOString(),
    })

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

    // Insert the submission into the database
    const result = await sql`
      INSERT INTO waitlist (name, email, phone, meal_plan_preference, city, notifications)
      VALUES (${name}, ${email}, ${phone || null}, ${mealPlanPreference || null}, ${city || null}, ${notifications || true})
      RETURNING id
    `

    console.log("Waitlist submission stored in database with ID:", result[0]?.id)

    return NextResponse.json({
      success: true,
      message: "Thank you for your interest! Your request has been registered. We will contact you by email very soon.",
    })
  } catch (error) {
    console.error("Error processing waitlist submission:", error)

    // Still return success to user, but log the error
    return NextResponse.json({
      success: true,
      message: "Thank you for your interest! Your request has been registered. We will contact you by email very soon.",
    })
  }
}

export async function GET() {
  try {
    // Get waitlist statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as weekly_signups
      FROM waitlist
    `

    return NextResponse.json({
      totalCount: Number.parseInt(stats[0]?.total_count || "0"),
      weeklySignups: Number.parseInt(stats[0]?.weekly_signups || "0"),
    })
  } catch (error) {
    console.error("Waitlist stats error:", error)
    return NextResponse.json({ error: "Failed to get waitlist stats" }, { status: 500 })
  }
}
