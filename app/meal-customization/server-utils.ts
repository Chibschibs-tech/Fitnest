import { cookies } from "next/headers"
import type { MealPreferences } from "./types"

export async function getMealPreferencesFromCookie(): Promise<MealPreferences | null> {
  const preferencesJson = cookies().get("meal_preferences")?.value
  if (!preferencesJson) {
    return null
  }

  try {
    return JSON.parse(preferencesJson) as MealPreferences
  } catch (e) {
    console.error("Error parsing preferences:", e)
    return null
  }
}

// Create a new server action to save cookies
export async function saveMealPreferencesToCookie(preferences: MealPreferences) {
  const preferencesJson = JSON.stringify(preferences)

  cookies().set("meal_preferences", preferencesJson, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return { success: true }
}
