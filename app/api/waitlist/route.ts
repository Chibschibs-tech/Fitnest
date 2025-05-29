import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, mealPlan, city, notifications } = body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "First name, last name, and email are required" }, { status: 400 })
    }

    // Check if email already exists in waitlist - with better error handling
    try {
      const existingUser = await sql`
        SELECT id FROM waitlist WHERE email = ${email}
      `

      if (existingUser && existingUser.length > 0) {
        return NextResponse.json(
          {
            error: "This email is already on our waitlist. Check your email for updates!",
            alreadyExists: true,
          },
          { status: 409 },
        )
      }
    } catch (checkError) {
      console.error("Error checking for existing email:", checkError)
      // Continue with the signup process even if the check fails
      // This prevents false "already exists" errors
    }

    // Insert into waitlist
    const result = await sql`
      INSERT INTO waitlist (
        first_name, 
        last_name, 
        email, 
        phone, 
        preferred_meal_plan, 
        city, 
        wants_notifications,
        created_at,
        position
      ) VALUES (
        ${firstName},
        ${lastName},
        ${email},
        ${phone || null},
        ${mealPlan || null},
        ${city || null},
        ${notifications || false},
        NOW(),
        (SELECT COALESCE(MAX(position), 0) + 1 FROM waitlist)
      )
      RETURNING id, position
    `

    // Get the current waitlist position
    const waitlistPosition = result[0]?.position || 1

    return NextResponse.json({
      success: true,
      message: "Successfully added to waitlist",
      position: waitlistPosition,
      estimatedWait: Math.ceil(waitlistPosition * 0.5), // Assuming 2 people per day, so 0.5 days per person
    })
  } catch (error) {
    console.error("Waitlist signup error:", error)

    // Check if it's a unique constraint violation (duplicate email)
    const errorMessage = String(error)
    if (errorMessage.includes("duplicate key") || errorMessage.includes("unique constraint")) {
      return NextResponse.json(
        {
          error: "This email is already on our waitlist. Check your email for updates!",
          alreadyExists: true,
        },
        { status: 409 },
      )
    }

    return NextResponse.json({ error: "Failed to add to waitlist. Please try again." }, { status: 500 })
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
