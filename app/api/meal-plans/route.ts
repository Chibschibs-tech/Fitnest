import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const plans = await sql(`
      SELECT 
        id,
        name,
        description,
        plan_type,
        target_calories_min,
        target_calories_max,
        weekly_price,
        is_active,
        created_at,
        updated_at
      FROM meal_plans 
      WHERE is_active = true
      ORDER BY weekly_price ASC
    `)

    // Transform the data to match frontend expectations
    const transformedPlans = plans.map((plan: any) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      planType: plan.plan_type,
      targetCaloriesMin: plan.target_calories_min,
      targetCaloriesMax: plan.target_calories_max,
      weeklyPrice: plan.weekly_price,
      isActive: plan.is_active,
      createdAt: plan.created_at,
      updatedAt: plan.updated_at,
    }))

    return NextResponse.json(transformedPlans)
  } catch (error) {
    console.error("Error fetching meal plans:", error)
    return NextResponse.json({ message: "Failed to fetch meal plans" }, { status: 500 })
  }
}
