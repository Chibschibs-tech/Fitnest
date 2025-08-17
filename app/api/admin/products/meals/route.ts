import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get all meals from the database
    const meals = await sql`
      SELECT 
        id,
        name,
        description,
        calories,
        protein,
        carbs,
        fat,
        price,
        category,
        image_url,
        is_available,
        created_at
      FROM meals 
      ORDER BY created_at DESC
    `

    // Transform the data to ensure proper types
    const transformedMeals = meals.map((meal) => ({
      id: Number(meal.id),
      name: meal.name || "Unnamed Meal",
      description: meal.description || "No description available",
      calories: Number(meal.calories) || 0,
      protein: Number(meal.protein) || 0,
      carbs: Number(meal.carbs) || 0,
      fat: Number(meal.fat) || 0,
      price: Number(meal.price) || 0,
      category: meal.category || "Uncategorized",
      image_url: meal.image_url || "",
      is_available: Boolean(meal.is_available),
      created_at: meal.created_at,
    }))

    return NextResponse.json({
      success: true,
      meals: transformedMeals,
      total: transformedMeals.length,
    })
  } catch (error) {
    console.error("Error fetching meals:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch meals",
        meals: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, calories, protein, carbs, fat, price, category, image_url, is_available = true } = body

    if (!name || !description) {
      return NextResponse.json({ message: "Name and description are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO meals (
        name, description, calories, protein, carbs, fat, 
        price, category, image_url, is_available
      )
      VALUES (
        ${name}, ${description}, ${calories || 0}, ${protein || 0}, 
        ${carbs || 0}, ${fat || 0}, ${price || 0}, ${category || "Uncategorized"}, 
        ${image_url || ""}, ${is_available}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      meal: result[0],
      message: "Meal created successfully",
    })
  } catch (error) {
    console.error("Error creating meal:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create meal",
      },
      { status: 500 },
    )
  }
}
