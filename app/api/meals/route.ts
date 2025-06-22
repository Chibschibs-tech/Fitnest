import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const meals = await sql`
      SELECT id, name, description, meal_type, ingredients, nutrition, image_url, tags, dietary_info, allergens
      FROM meals
      ORDER BY id DESC
    `

    // Return the meals array directly, not wrapped in an object
    return NextResponse.json(
      meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        description: meal.description,
        mealType: meal.meal_type || "main",
        ingredients: meal.ingredients || meal.description || {},
        nutrition: meal.nutrition || {},
        imageUrl: meal.image_url || "/placeholder.svg?height=200&width=300",
        tags: meal.tags || [],
        dietaryInfo: meal.dietary_info || [],
        allergens: meal.allergens || [],
        usdaVerified: false,
        isActive: true,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    )
  } catch (error) {
    console.error("Error fetching meals:", error)
    return NextResponse.json([], { status: 500 })
  }
}
