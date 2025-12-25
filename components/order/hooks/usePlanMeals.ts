"use client"

import { useState, useEffect } from "react"
import { Meal } from "../types"

export function usePlanMeals(mealIds: string[]) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMeals() {
      if (mealIds.length === 0) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Fetch all meals in parallel using our internal API route (no CORS issues)
        const mealPromises = mealIds.map(async (id) => {
          try {
            const response = await fetch(`/api/internal/meals/${id}`, {
              cache: 'no-store',
              headers: { 'Accept': 'application/json' },
            })
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}))
              console.error(`Failed to fetch meal ${id}:`, response.status, errorData)
              throw new Error(`Failed to fetch meal ${id}: ${response.status}`)
            }
            
            return await response.json()
          } catch (err) {
            console.error(`Error fetching meal ${id}:`, err)
            throw err
          }
        })

        const results = await Promise.allSettled(mealPromises)
        
        // Transform meals, filtering out failed requests
        const transformedMeals: Meal[] = results
          .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
          .map((result) => {
            const data = result.value
            const meal = data.data || data
            return {
              id: String(meal.id),
              name: meal.name || 'Unnamed Meal',
              description: meal.description || '',
              image: meal.image || meal.image_url || '/placeholder.svg',
              sku: meal.sku || '',
              calories: Number(meal.calories) || 0,
              protein: Number(meal.protein) || 0,
              carbohydrates: Number(meal.carbohydrates || meal.carbs) || 0,
              fats: Number(meal.fats || meal.fat) || 0,
              meal_type: meal.meal_type || meal.type || 'lunch',
            }
          })

        // Check for any failures and log them
        const failures = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        if (failures.length > 0) {
          console.warn(`${failures.length} meal(s) failed to load:`, failures.map(f => f.reason))
          // Set a warning but don't fail entirely if we got some meals
          if (transformedMeals.length === 0) {
            setError(`Failed to load all meals. Please try again.`)
          } else {
            setError(`Some meals failed to load (${failures.length}/${mealIds.length})`)
          }
        }

        setMeals(transformedMeals)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load meals'
        setError(errorMessage)
        console.error('Error fetching meals:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeals()
  }, [mealIds.join(',')])

  return { meals, isLoading, error }
}
