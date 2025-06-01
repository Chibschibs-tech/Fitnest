import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const planId = Number.parseInt(params.id)

    if (isNaN(planId)) {
      return NextResponse.json({ message: "Invalid meal plan ID" }, { status: 400 })
    }

    // Get meal plan details
    const plans = await sql(
      `
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
      WHERE id = $1 AND is_active = true
    `,
      [planId],
    )

    if (plans.length === 0) {
      return NextResponse.json({ message: "Meal plan not found" }, { status: 404 })
    }

    const plan = plans[0]

    // Get meals associated with this plan
    const planMeals = await sql(
      `
      SELECT 
        mpi.portion_multiplier,
        mpi.meal_type,
        mpi.sort_order,
        m.id,
        m.name,
        m.description,
        m.meal_type as original_meal_type,
        m.ingredients,
        m.nutrition,
        m.image_url,
        m.tags,
        m.dietary_info,
        m.allergens,
        m.usda_verified
      FROM meal_plan_items mpi
      JOIN meals m ON mpi.meal_id = m.id
      WHERE mpi.meal_plan_id = $1 AND m.is_active = true
      ORDER BY mpi.sort_order ASC
    `,
      [planId],
    )

    // Transform meals with portion adjustments
    const transformedMeals = planMeals.map((item: any) => {
      const adjustedNutrition = {
        calories: Math.round((item.nutrition?.calories || 0) * item.portion_multiplier),
        protein: Math.round((item.nutrition?.protein || 0) * item.portion_multiplier),
        carbs: Math.round((item.nutrition?.carbs || 0) * item.portion_multiplier),
        fat: Math.round((item.nutrition?.fat || 0) * item.portion_multiplier),
        fiber: Math.round((item.nutrition?.fiber || 0) * item.portion_multiplier),
        sugar: Math.round((item.nutrition?.sugar || 0) * item.portion_multiplier),
        sodium: Math.round((item.nutrition?.sodium || 0) * item.portion_multiplier),
      }

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        mealType: item.meal_type, // Use the meal type from meal_plan_items
        originalMealType: item.original_meal_type,
        ingredients: item.ingredients,
        nutrition: adjustedNutrition,
        imageUrl: item.image_url,
        tags: item.tags,
        dietaryInfo: item.dietary_info,
        allergens: item.allergens,
        usdaVerified: item.usda_verified,
        portionMultiplier: item.portion_multiplier,
        sortOrder: item.sort_order,
        // Extract nutrition values for easy access
        calories: adjustedNutrition.calories,
        protein: adjustedNutrition.protein,
        carbs: adjustedNutrition.carbs,
        fat: adjustedNutrition.fat,
        fiber: adjustedNutrition.fiber,
        sugar: adjustedNutrition.sugar,
        sodium: adjustedNutrition.sodium,
      }
    })

    // Transform the plan data
    const transformedPlan = {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      planType: plan.plan_type,
      targetCaloriesMin: plan.target_calories_min,
      targetCaloriesMax: plan.target_calories_max,
      weeklyPrice: plan.weekly_price,
      isActive: plan.is_active,
      meals: transformedMeals,
      createdAt: plan.created_at,
      updatedAt: plan.updated_at,
    }

    return NextResponse.json(transformedPlan)
  } catch (error) {
    console.error("Error fetching meal plan:", error)
    return NextResponse.json({ message: "Failed to fetch meal plan" }, { status: 500 })
  }
}
