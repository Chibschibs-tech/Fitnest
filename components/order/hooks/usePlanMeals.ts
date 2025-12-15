"use client"

import { useState, useEffect } from "react"
import { Meal } from "../types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'

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

        // Fetch all meals in parallel
        const mealPromises = mealIds.map(id =>
          fetch(`${API_BASE}/meals/${id}`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' },
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch meal ${id}`)
            return res.json()
          })
        )

        const results = await Promise.all(mealPromises)
        
        // Transform meals
        const transformedMeals: Meal[] = results.map((data: any) => {
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
