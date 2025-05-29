import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import type { MealPreferences } from "@/app/meal-customization/types"

export async function POST(request: Request) {
  try {
    const preferences = (await request.json()) as MealPreferences

    // Save to cookies for guest users
    const preferencesJson = JSON.stringify(preferences)

    cookies().set("meal_preferences", preferencesJson, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({
      success: true,
      isGuest: true,
      preferences,
    })
  } catch (error) {
    console.error("Error saving meal preferences:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save preferences",
      },
      { status: 500 },
    )
  }
}
