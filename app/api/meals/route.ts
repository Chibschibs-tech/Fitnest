import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!)
    const { searchParams } = new URL(request.url)
    const mealType = searchParams.get("type")

    let query
    if (mealType && mealType !== "all") {
      query = sql`
        SELECT id, name, description, calories, protein, carbs, fat, image_url, category, created_at, updated_at
        FROM meals
        WHERE category = ${mealType}
        ORDER BY created_at DESC
      `
    } else {
      query = sql`
        SELECT id, name, description, calories, protein, carbs, fat, image_url, category, created_at, updated_at
        FROM meals
        ORDER BY created_at DESC
      `
    }

    const meals = await query

    // Transform the data to match what the frontend expects
    const transformedMeals = meals.map((meal) => ({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      mealType: meal.category,
      ingredients: meal.description, // Using description as ingredients for now
      nutrition: {
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
      },
      imageUrl: meal.image_url,
      tags: [],
      dietaryInfo: [],
      allergens: [],
      usdaVerified: false,
      isActive: true,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      createdAt: meal.created_at,
      updatedAt: meal.updated_at,
    }))

    return NextResponse.json(transformedMeals)
  } catch (error) {
    console.error("Error fetching meals:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch meals",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
