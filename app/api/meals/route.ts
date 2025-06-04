import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mealType = searchParams.get("type")

    let query = sql`
      SELECT id, name, description, meal_type, ingredients, nutrition, image_url, tags, dietary_info, allergens
      FROM meals
      WHERE 1=1
    `

    if (mealType && mealType !== "all") {
      query = sql`
        SELECT id, name, description, meal_type, ingredients, nutrition, image_url, tags, dietary_info, allergens
        FROM meals
        WHERE meal_type = ${mealType}
      `
    }

    const meals = await query

    return NextResponse.json({
      success: true,
      meals,
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
