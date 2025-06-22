import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Try different environment variables
    const dbUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL

    if (!dbUrl) {
      throw new Error("No database URL found in environment variables")
    }

    const sql = neon(dbUrl)
    const { searchParams } = new URL(request.url)
    const mealType = searchParams.get("type")

    let meals
    if (mealType && mealType !== "all") {
      meals = await sql`
        SELECT id, name, description, "imageUrl", category, "createdAt", "updatedAt"
        FROM meals
        WHERE category = ${mealType}
        ORDER BY "createdAt" DESC
      `
    } else {
      meals = await sql`
        SELECT id, name, description, "imageUrl", category, "createdAt", "updatedAt"
        FROM meals
        ORDER BY "createdAt" DESC
      `
    }

    return NextResponse.json({
      success: true,
      meals: meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        description: meal.description,
        meal_type: meal.category,
        ingredients: meal.description,
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
        image_url: meal.imageUrl,
        tags: [],
        dietary_info: [],
        allergens: [],
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
