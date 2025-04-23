import { NextResponse } from "next/server"
import { db, meals } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const query = searchParams.get("query")

    let mealsQuery = db.select().from(meals).where({ isActive: true })

    // Apply type filter if provided
    if (type && type !== "all") {
      mealsQuery = mealsQuery.where({ mealType: type })
    }

    // Execute the query
    const mealsList = await mealsQuery

    // Apply search filter if provided (we do this in JS since it's more complex)
    let filteredMeals = mealsList
    if (query) {
      const searchQuery = query.toLowerCase()
      filteredMeals = mealsList.filter(
        (meal) => meal.name.toLowerCase().includes(searchQuery) || meal.description.toLowerCase().includes(searchQuery),
      )
    }

    return NextResponse.json(filteredMeals)
  } catch (error) {
    console.error("Error fetching meals:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
