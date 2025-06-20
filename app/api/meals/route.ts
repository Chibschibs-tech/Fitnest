import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { searchParams } = new URL(request.url)
    const mealType = searchParams.get("type")

    let meals
    if (mealType && mealType !== "all") {
      meals = await sql`
        SELECT id, name, description, calories, protein, carbs, fat, "imageUrl", category, "createdAt", "updatedAt"
        FROM meals
        WHERE category = ${mealType}
        ORDER BY "createdAt" DESC
      `
    } else {
      meals = await sql`
        SELECT id, name, description, calories, protein, carbs, fat, "imageUrl", category, "createdAt", "updatedAt"
        FROM meals
        ORDER BY "createdAt" DESC
      `
    }

    // Transform the data to match what the frontend expects
    const transformedMeals = meals.map((meal) => ({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      mealType: meal.category,
      ingredients: meal.description, // Using description as ingredients
      nutrition: {
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
      },
      imageUrl: meal.imageUrl,
      tags: [],
      dietaryInfo: [],
      allergens: [],
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
