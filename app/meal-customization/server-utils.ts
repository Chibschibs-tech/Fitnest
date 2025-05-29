// This file is for server-side code only
import { cookies } from "next/headers"
import type { MealPreferences } from "./types"

export async function getMealPreferencesFromCookie(): Promise<MealPreferences | null> {
  const cookieStore = cookies()
  const preferencesJson = cookieStore.get("meal_preferences")?.value

  if (!preferencesJson) {
    return null
  }

  try {
    return JSON.parse(preferencesJson) as MealPreferences
  } catch (e) {
    console.error("Error parsing meal preferences from cookie:", e)
    return null
  }
}

export async function saveMealPreferencesToCookie(preferences: MealPreferences): Promise<void> {
  const preferencesJson = JSON.stringify(preferences)

  cookies().set("meal_preferences", preferencesJson, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}
