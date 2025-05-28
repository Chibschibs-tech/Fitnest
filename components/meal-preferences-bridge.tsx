"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { MealPreferences } from "@/app/meal-customization/types"

export function MealPreferencesBridge() {
  const router = useRouter()

  useEffect(() => {
    // Check if we have preferences in localStorage
    const storedPreferences = localStorage.getItem("meal_preferences")

    if (storedPreferences) {
      try {
        const preferences = JSON.parse(storedPreferences) as MealPreferences

        // Add preferences to URL and navigate
        const encodedPreferences = encodeURIComponent(storedPreferences)
        router.push(`/meal-plans/preview?preferences=${encodedPreferences}`)

        // Clear localStorage after use
        localStorage.removeItem("meal_preferences")
      } catch (e) {
        console.error("Error parsing preferences from localStorage:", e)
      }
    }
  }, [router])

  return null // This component doesn't render anything
}
