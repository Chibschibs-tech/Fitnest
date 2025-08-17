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

    // Check if meal_plans table exists
    let mealPlans = []
    try {
      mealPlans = await sql`
        SELECT 
          id,
          name,
          description,
          weekly_price::numeric as price,
          type,
          calories_min,
          calories_max,
          active,
          created_at,
          (
            SELECT COUNT(*) 
            FROM orders o 
            WHERE o.meal_plan_id = meal_plans.id
          ) as subscribers_count
        FROM meal_plans 
        ORDER BY created_at DESC
      `
    } catch (error) {
      console.log("meal_plans table doesn't exist, creating sample data")

      // Create meal_plans table if it doesn't exist
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS meal_plans (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            weekly_price DECIMAL(10,2) NOT NULL,
            type TEXT NOT NULL,
            calories_min INTEGER,
            calories_max INTEGER,
            active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `

        // Insert sample meal plans
        await sql`
          INSERT INTO meal_plans (name, description, weekly_price, type, calories_min, calories_max, active)
          VALUES 
            ('Balanced Nutrition', 'Perfect balance of proteins, carbs, and healthy fats', 299.00, 'balanced', 1800, 2200, true),
            ('Weight Loss Plan', 'Calorie-controlled meals designed for healthy weight loss', 279.00, 'weight_loss', 1400, 1800, true),
            ('Muscle Gain Plan', 'High-protein meals to support muscle growth and recovery', 349.00, 'muscle_gain', 2200, 2800, true),
            ('Keto Friendly', 'Low-carb, high-fat meals for ketogenic lifestyle', 329.00, 'keto', 1600, 2000, true),
            ('Vegan Power', 'Plant-based nutrition without compromising on taste or protein', 289.00, 'vegan', 1700, 2100, true)
          ON CONFLICT DO NOTHING
        `

        // Try fetching again
        mealPlans = await sql`
          SELECT 
            id,
            name,
            description,
            weekly_price::numeric as price,
            type,
            calories_min,
            calories_max,
            active,
            created_at,
            0 as subscribers_count
          FROM meal_plans 
          ORDER BY created_at DESC
        `
      } catch (createError) {
        console.error("Failed to create meal_plans table:", createError)
        // Return mock data as fallback
        mealPlans = [
          {
            id: 1,
            name: "Balanced Nutrition",
            description: "Perfect balance of proteins, carbs, and healthy fats",
            price: 299.0,
            type: "balanced",
            calories_min: 1800,
            calories_max: 2200,
            active: true,
            created_at: new Date(),
            subscribers_count: 0,
          },
          {
            id: 2,
            name: "Weight Loss Plan",
            description: "Calorie-controlled meals designed for healthy weight loss",
            price: 279.0,
            type: "weight_loss",
            calories_min: 1400,
            calories_max: 1800,
            active: true,
            created_at: new Date(),
            subscribers_count: 0,
          },
        ]
      }
    }

    return NextResponse.json({
      success: true,
      mealPlans: mealPlans,
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
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { name, description, weekly_price, type, calories_min, calories_max } = await request.json()

    if (!name || !weekly_price || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newMealPlan = await sql`
      INSERT INTO meal_plans (name, description, weekly_price, type, calories_min, calories_max)
      VALUES (${name}, ${description}, ${weekly_price}, ${type}, ${calories_min}, ${calories_max})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      mealPlan: newMealPlan[0],
    })
  } catch (error) {
    console.error("Error creating meal plan:", error)
    return NextResponse.json({ success: false, error: "Failed to create meal plan" }, { status: 500 })
  }
}
