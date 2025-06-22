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
        SELECT id, name, description, meal_type, image_url
        FROM meals
        WHERE meal_type = ${mealType}
        ORDER BY name ASC
      `
    } else {
      meals = await sql`
        SELECT id, name, description, meal_type, image_url
        FROM meals
        ORDER BY meal_type ASC, name ASC
      `
    }

    return NextResponse.json(
      meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        description: meal.description,
        mealType: meal.meal_type,
        ingredients: meal.description,
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
        imageUrl: meal.image_url,
        tags: [],
        dietaryInfo: [],
        allergens: [],
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
