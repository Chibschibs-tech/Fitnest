import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get meal plans from database
    const mealPlans = await sql`
      SELECT 
        id,
        name,
        description,
        weekly_price as price_per_week,
        duration_weeks,
        meals_per_day,
        type as category,
        features,
        image_url,
        active as is_available,
        created_at
      FROM meal_plans
      ORDER BY created_at DESC
    `

    // Add subscriber count (mock for now)
    const mealPlansWithSubscribers = mealPlans.map((plan: any) => ({
      ...plan,
      subscribers_count: Math.floor(Math.random() * 50) + 1, // Mock data
    }))

    return NextResponse.json({
      success: true,
      mealPlans: mealPlansWithSubscribers,
    })
  } catch (error) {
    console.error("Error fetching meal plans:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch meal plans",
        mealPlans: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()

    const newMealPlan = await sql`
      INSERT INTO meal_plans (
        name, description, weekly_price, type, 
        calories_min, calories_max, active
      )
      VALUES (
        ${data.name}, ${data.description}, ${data.weeklyPrice}, ${data.type},
        ${data.caloriesMin || null}, ${data.caloriesMax || null}, ${data.active !== false}
      )
      RETURNING *
    `

    return NextResponse.json(newMealPlan[0], { status: 201 })
  } catch (error) {
    console.error("Error creating meal plan:", error)
    return NextResponse.json({ error: "Failed to create meal plan" }, { status: 500 })
  }
}
