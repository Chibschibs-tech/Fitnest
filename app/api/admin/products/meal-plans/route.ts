import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Create meal_plans table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS meal_plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        weekly_price DECIMAL(10,2) NOT NULL,
        type VARCHAR(100),
        calories_min INTEGER,
        calories_max INTEGER,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if we have sample data
    const planCount = await sql`SELECT COUNT(*) as count FROM meal_plans`

    if (planCount[0].count === 0) {
      // Insert sample meal plans
      await sql`
        INSERT INTO meal_plans (name, description, weekly_price, type, calories_min, calories_max, active)
        VALUES 
          ('Weight Loss Plan', 'Carefully crafted meals to support healthy weight loss', 89.99, 'weight_loss', 1200, 1500, true),
          ('Muscle Gain Plan', 'High-protein meals designed for muscle building', 109.99, 'muscle_gain', 2000, 2500, true),
          ('Keto Plan', 'Low-carb, high-fat meals for ketogenic lifestyle', 99.99, 'keto', 1500, 1800, true),
          ('Balanced Plan', 'Well-rounded meals for general health and wellness', 79.99, 'balanced', 1600, 2000, true),
          ('Vegan Plan', 'Plant-based meals packed with nutrients', 94.99, 'vegan', 1400, 1800, true),
          ('Mediterranean Plan', 'Heart-healthy Mediterranean-style meals', 104.99, 'mediterranean', 1700, 2100, true)
      `
    }

    const mealPlans = await sql`
      SELECT 
        id,
        name,
        description,
        weekly_price as "weeklyPrice",
        type,
        calories_min as "caloriesMin",
        calories_max as "caloriesMax",
        active,
        created_at as "createdAt"
      FROM meal_plans
      ORDER BY created_at DESC
    `

    return NextResponse.json(mealPlans)
  } catch (error) {
    console.error("Error fetching meal plans:", error)
    return NextResponse.json({ error: "Failed to fetch meal plans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
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
