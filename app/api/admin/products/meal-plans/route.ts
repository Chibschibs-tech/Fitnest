import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

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
