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
