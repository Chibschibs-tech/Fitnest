import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { searchParams } = new URL(request.url)
    const mealType = searchParams.get("type")

    // Just get all meals without filtering by category since that column doesn't exist
    const meals = await sql`
      SELECT id, name, description, meal_type, ingredients, nutrition, image_url, tags, dietary_info, allergens
      FROM meals
      ORDER BY id DESC
    `

    return NextResponse.json({
      success: true,
      meals: meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        description: meal.description,
        meal_type: meal.meal_type,
        ingredients: meal.ingredients || meal.description,
        nutrition: meal.nutrition || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
        image_url: meal.image_url,
        tags: meal.tags || [],
        dietary_info: meal.dietary_info || [],
        allergens: meal.allergens || [],
      })),
    })
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
