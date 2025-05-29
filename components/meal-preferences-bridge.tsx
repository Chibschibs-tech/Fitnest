"use client"

import { useEffect } from "react"

export function MealPreferencesBridge() {
  useEffect(() => {
    // This component handles client-side meal preferences bridging
    // without using next/headers
    const preferences = localStorage.getItem("meal_preferences")
    if (preferences) {
      // Handle preferences if needed
      console.log("Meal preferences found in localStorage")
    }
  }, [])

  return null
}
