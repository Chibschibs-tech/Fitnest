"use client"

import { useState, useEffect } from "react"
import { MealPlan, APIResponse } from "../types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'

export function useMealPlans() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMealPlans() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE}/meal-plans?status=active`, {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch meal plans: ${response.status}`)
        }

        const data: APIResponse<MealPlan[]> = await response.json()
        
        // Handle different API response structures
        let plans: MealPlan[] = []
        if (Array.isArray(data.data)) {
          plans = data.data
        } else if (Array.isArray(data)) {
          plans = data as unknown as MealPlan[]
        } else if (data.mealPlans && Array.isArray(data.mealPlans)) {
          plans = data.mealPlans
        }

        // Transform and validate data
        const transformedPlans = plans.map((plan: any) => ({
          id: String(plan.id),
          name: plan.name || 'Unnamed Plan',
          description: plan.description || '',
          image: plan.image || plan.image_url || '/placeholder.svg',
          sku: plan.sku || '',
          status: plan.status || 'active',
          breakfast_price_per_day: Number(plan.breakfast_price_per_day) || 0,
          lunch_price_per_day: Number(plan.lunch_price_per_day) || 0,
          dinner_price_per_day: Number(plan.dinner_price_per_day) || 0,
          snack_price_per_day: Number(plan.snack_price_per_day) || 0,
          created_at: plan.created_at || new Date().toISOString(),
          updated_at: plan.updated_at || new Date().toISOString(),
          meals: plan.meals || {},
        }))

        setMealPlans(transformedPlans)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        console.error('Error fetching meal plans:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMealPlans()
  }, [])

  return { mealPlans, isLoading, error }
}
