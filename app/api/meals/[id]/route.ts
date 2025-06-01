import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const mealId = Number.parseInt(params.id)

    if (isNaN(mealId)) {
      return NextResponse.json({ message: "Invalid meal ID" }, { status: 400 })
    }

    const meals = await sql(
      `
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
      WHERE id = $1 AND is_active = true
    `,
      [mealId],
    )

    if (meals.length === 0) {
      return NextResponse.json({ message: "Meal not found" }, { status: 404 })
    }

    const meal = meals[0]

    const transformedMeal = {
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
    }

    return NextResponse.json(transformedMeal)
  } catch (error) {
    console.error("Error fetching meal:", error)
    return NextResponse.json({ message: "Failed to fetch meal" }, { status: 500 })
  }
}
