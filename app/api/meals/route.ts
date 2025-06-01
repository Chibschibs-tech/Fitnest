import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    console.log("API called - fetching meals")
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL)

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const query = searchParams.get("query")

    let sqlQuery = `
      SELECT 
        id,
        name,
        description,
        meal_type,
        ingredients,
        nutrition,
        image_url,
        tags,
        dietary_info,
        allergens,
        usda_verified,
        is_active,
        created_at,
        updated_at
      FROM meals 
      WHERE is_active = true
    `
    const params: any[] = []

    // Apply type filter if provided
    if (type && type !== "all") {
      sqlQuery += ` AND meal_type = $${params.length + 1}`
      params.push(type)
    }

    // Apply search filter if provided
    if (query) {
      sqlQuery += ` AND (
        LOWER(name) LIKE $${params.length + 1} OR 
        LOWER(description) LIKE $${params.length + 2}
      )`
      const searchTerm = `%${query.toLowerCase()}%`
      params.push(searchTerm, searchTerm)
    }

    sqlQuery += ` ORDER BY created_at DESC`

    console.log("Executing SQL:", sqlQuery)
    console.log("With params:", params)

    const meals = await sql(sqlQuery, params)

    console.log("Raw meals from DB:", meals)
    console.log("Number of meals found:", meals.length)

    // Transform the data to match frontend expectations
    const transformedMeals = meals.map((meal: any) => ({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      mealType: meal.meal_type,
      ingredients: meal.ingredients,
      nutrition: meal.nutrition,
      imageUrl: meal.image_url,
      tags: meal.tags,
      dietaryInfo: meal.dietary_info,
      allergens: meal.allergens,
      usdaVerified: meal.usda_verified,
      isActive: meal.is_active,
      calories: meal.nutrition?.calories || 0,
      protein: meal.nutrition?.protein || 0,
      carbs: meal.nutrition?.carbs || 0,
      fat: meal.nutrition?.fat || 0,
      fiber: meal.nutrition?.fiber || 0,
      sugar: meal.nutrition?.sugar || 0,
      sodium: meal.nutrition?.sodium || 0,
      createdAt: meal.created_at,
      updatedAt: meal.updated_at,
    }))

    console.log("Transformed meals:", transformedMeals)
    console.log("Returning meals count:", transformedMeals.length)

    return NextResponse.json(transformedMeals)
  } catch (error) {
    console.error("Error fetching meals:", error)
    return NextResponse.json(
      {
        message: "Failed to fetch meals",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
