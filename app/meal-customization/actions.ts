"use server"

import { cookies } from "next/headers"
import type { MealPreferences } from "./types"

export async function saveMealPreferences(preferences: MealPreferences) {
  try {
    // Save to cookies for guest users
    const preferencesJson = JSON.stringify(preferences)

    cookies().set("meal_preferences", preferencesJson, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      success: true,
      isGuest: true,
      preferences,
    }
  } catch (error) {
    console.error("Error saving meal preferences:", error)
    return {
      success: false,
      error: "Failed to save preferences",
    }
  }
}
