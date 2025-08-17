import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get meals from existing meals table
    const meals = await sql`
      SELECT 
        id,
        name,
        description,
        COALESCE(calories, 0) as calories,
        COALESCE(protein, 0) as protein,
        COALESCE(carbs, 0) as carbs,
        COALESCE(fat, 0) as fat,
        COALESCE(category, 'main') as category,
        image_url as "imageUrl",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM meals
      ORDER BY created_at DESC
    `

    // Transform data to match the interface
    const transformedMeals = meals.map((meal: any) => ({
      id: meal.id,
      name: meal.name,
      description: meal.description || "No description available",
      price: 12.99, // Default price since not in meals table
      subscriptionPrice: 10.99,
      category: meal.category,
      availability: "both",
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      active: true,
      createdAt: meal.createdAt,
    }))

    return NextResponse.json(transformedMeals)
  } catch (error) {
    console.error("Error fetching meals:", error)
    return NextResponse.json({ error: "Failed to fetch meals" }, { status: 500 })
  }
}
