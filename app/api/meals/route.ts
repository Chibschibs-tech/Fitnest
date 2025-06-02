import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    console.log("Fetching meals from database...")

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const query = searchParams.get("query")

    let meals

    // Handle different query scenarios with tagged templates
    if (type && type !== "all" && query) {
      // Both type and search query
      const searchTerm = `%${query.toLowerCase()}%`
      meals = await sql`
        SELECT 
          id, name, description, meal_type, ingredients, nutrition, 
          image_url, tags, dietary_info, allergens, usda_verified, 
          is_active, created_at, updated_at
        FROM meals 
        WHERE is_active = true 
        AND meal_type = ${type}
        AND (LOWER(name) LIKE ${searchTerm} OR LOWER(description) LIKE ${searchTerm})
        ORDER BY created_at DESC
      `
    } else if (type && type !== "all") {
      // Only type filter
      meals = await sql`
        SELECT 
          id, name, description, meal_type, ingredients, nutrition, 
          image_url, tags, dietary_info, allergens, usda_verified, 
          is_active, created_at, updated_at
        FROM meals 
        WHERE is_active = true 
        AND meal_type = ${type}
        ORDER BY created_at DESC
      `
    } else if (query) {
      // Only search query
      const searchTerm = `%${query.toLowerCase()}%`
      meals = await sql`
        SELECT 
          id, name, description, meal_type, ingredients, nutrition, 
          image_url, tags, dietary_info, allergens, usda_verified, 
          is_active, created_at, updated_at
        FROM meals 
        WHERE is_active = true 
        AND (LOWER(name) LIKE ${searchTerm} OR LOWER(description) LIKE ${searchTerm})
        ORDER BY created_at DESC
      `
    } else {
      // No filters - get all meals
      meals = await sql`
        SELECT 
          id, name, description, meal_type, ingredients, nutrition, 
          image_url, tags, dietary_info, allergens, usda_verified, 
          is_active, created_at, updated_at
        FROM meals 
        WHERE is_active = true
        ORDER BY created_at DESC
      `
    }

    console.log(`Found ${meals.length} meals`)

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
