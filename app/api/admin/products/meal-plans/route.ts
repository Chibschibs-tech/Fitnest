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

    console.log("Fetching meal plans...")

    // Get meal plans from database - using only existing columns
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
        created_at,
        calories_min,
        calories_max
      FROM meal_plans
      ORDER BY created_at DESC
    `

    // Add subscriber count (we'll calculate this from orders)
    const mealPlansWithSubscribers = await Promise.all(
      mealPlans.map(async (plan) => {
        try {
          // Count subscribers for this meal plan
          const subscriberCount = await sql`
            SELECT COUNT(DISTINCT user_id) as count
            FROM orders 
            WHERE meal_plan_id = ${plan.id}
            AND status != 'cancelled'
          `

          return {
            ...plan,
            subscribers_count: Number(subscriberCount[0]?.count || 0),
          }
        } catch (error) {
          console.log(`Error counting subscribers for plan ${plan.id}:`, error)
          return {
            ...plan,
            subscribers_count: 0,
          }
        }
      }),
    )

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
        calories_min, calories_max, active, duration_weeks, meals_per_day
      )
      VALUES (
        ${data.name}, 
        ${data.description}, 
        ${data.weeklyPrice || data.price_per_week}, 
        ${data.type || data.category},
        ${data.caloriesMin || data.calories_min || null}, 
        ${data.caloriesMax || data.calories_max || null}, 
        ${data.active !== false},
        ${data.duration_weeks || 4},
        ${data.meals_per_day || 3}
      )
      RETURNING *
    `

    return NextResponse.json(
      {
        success: true,
        mealPlan: newMealPlan[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating meal plan:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create meal plan",
      },
      { status: 500 },
    )
  }
}
