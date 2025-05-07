import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { cookies } from "next/headers"
import { db, mealPreferences } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      // For non-authenticated users, try to get from cookies
      const cookieStore = cookies()
      const preferencesJson = cookieStore.get("meal_preferences")

      if (preferencesJson) {
        return NextResponse.json(JSON.parse(preferencesJson.value))
      }

      return NextResponse.json({ message: "No preferences found" }, { status: 404 })
    }

    const userId = Number.parseInt(session.user.id as string)

    // Get preferences from database
    const userPreferences = await db.select().from(mealPreferences).where(eq(mealPreferences.userId, userId)).limit(1)

    if (userPreferences.length > 0) {
      // Parse JSON strings back to arrays
      const preferences = userPreferences[0]
      return NextResponse.json({
        ...preferences,
        dietaryPreferences: JSON.parse(preferences.dietaryPreferences),
        allergies: JSON.parse(preferences.allergies),
        excludedIngredients: JSON.parse(preferences.excludedIngredients),
      })
    }

    // Fallback to cookies if no preferences in database
    const cookieStore = cookies()
    const preferencesJson = cookieStore.get("meal_preferences")

    if (preferencesJson) {
      return NextResponse.json(JSON.parse(preferencesJson.value))
    }

    return NextResponse.json({ message: "No preferences found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching meal preferences:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    const preferences = await request.json()

    // Validate input
    if (!preferences.planType || !preferences.calorieTarget) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Save to cookies for non-authenticated users
    if (!session || !session.user) {
      const cookieStore = cookies()
      cookieStore.set("meal_preferences", JSON.stringify(preferences), {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })
      return NextResponse.json({ message: "Preferences saved to cookies" })
    }

    const userId = Number.parseInt(session.user.id as string)

    // Stringify arrays for storage
    const preferencesToStore = {
      ...preferences,
      dietaryPreferences: JSON.stringify(preferences.dietaryPreferences || []),
      allergies: JSON.stringify(preferences.allergies || []),
      excludedIngredients: JSON.stringify(preferences.excludedIngredients || []),
    }

    // Check if user already has preferences
    const existingPreferences = await db
      .select()
      .from(mealPreferences)
      .where(eq(mealPreferences.userId, userId))
      .limit(1)

    if (existingPreferences.length > 0) {
      // Update existing preferences
      await db
        .update(mealPreferences)
        .set({
          planType: preferencesToStore.planType,
          calorieTarget: preferencesToStore.calorieTarget,
          mealsPerDay: preferencesToStore.mealsPerDay,
          daysPerWeek: preferencesToStore.daysPerWeek,
          dietaryPreferences: preferencesToStore.dietaryPreferences,
          allergies: preferencesToStore.allergies,
          excludedIngredients: preferencesToStore.excludedIngredients,
          updatedAt: new Date(),
        })
        .where(eq(mealPreferences.userId, userId))
    } else {
      // Insert new preferences
      await db.insert(mealPreferences).values({
        userId,
        planType: preferencesToStore.planType,
        calorieTarget: preferencesToStore.calorieTarget,
        mealsPerDay: preferencesToStore.mealsPerDay,
        daysPerWeek: preferencesToStore.daysPerWeek,
        dietaryPreferences: preferencesToStore.dietaryPreferences,
        allergies: preferencesToStore.allergies,
        excludedIngredients: preferencesToStore.excludedIngredients,
      })
    }

    return NextResponse.json({ message: "Preferences saved successfully" })
  } catch (error) {
    console.error("Error saving meal preferences:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
