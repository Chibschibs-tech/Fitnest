"use client"

import { useState, useMemo } from "react"
import { Loader2, AlertCircle, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MealPlan, OrderPreferences, Meal, MealSelections, MenuBuildData } from "../types"
import { usePlanMeals } from "../hooks/usePlanMeals"
import { DayMealSelector } from "../DayMealSelector"

// Helper function to format date as Y-m-d
const formatDateYMD = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface BuildMenuProps {
  selectedPlan: MealPlan
  preferences: OrderPreferences
  onNext: (menuData: MenuBuildData, meals: Meal[]) => void
  onBack: () => void
}

export function BuildMenu({ selectedPlan, preferences, onNext, onBack }: BuildMenuProps) {
  // Extract all unique meal IDs from the plan
  const allMealIds = useMemo(() => {
    const ids = new Set<string>()
    
    if (selectedPlan.meals) {
      Object.values(selectedPlan.meals).forEach((mealList: any) => {
        if (Array.isArray(mealList)) {
          mealList.forEach(id => ids.add(id))
        }
      })
    }
    
    return Array.from(ids)
  }, [selectedPlan])

  const { meals, isLoading, error } = usePlanMeals(allMealIds)

  console.log(selectedPlan)

  // Initialize selections state
  const [selections, setSelections] = useState<MealSelections>(() => {
    const initial: MealSelections = {}
    preferences.deliveryDays.forEach(day => {
      const dayKey = formatDateYMD(day)
      initial[dayKey] = {}
    })
    return initial
  })

  // Group meals by type based on the plan structure
  const mealsByType = useMemo(() => {
    const grouped: { [key: string]: Meal[] } = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    }

    // Create a map of meal ID to meal object for quick lookup
    const mealMap = new Map(meals.map(meal => [meal.id, meal]))

    // Group meals based on how they're organized in the selected plan
    if (selectedPlan.meals) {
      Object.entries(selectedPlan.meals).forEach(([mealType, mealIds]: [string, any]) => {
        if (Array.isArray(mealIds) && grouped[mealType]) {
          mealIds.forEach(mealId => {
            const meal = mealMap.get(String(mealId))
            if (meal) {
              grouped[mealType].push(meal)
            }
          })
        }
      })
    }

    return grouped
  }, [meals, selectedPlan])

  const handleMealSelect = (day: Date, mealType: string, mealId: string) => {
    const dayKey = formatDateYMD(day)
    setSelections(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [mealType]: mealId,
      },
    }))
  }

  // Validate all days have all meals selected
  const validateSelections = (): boolean => {
    for (const day of preferences.deliveryDays) {
      const dayKey = formatDateYMD(day)
      const daySelections = selections[dayKey] || {}

      // Check all main meals
      for (const mealType of preferences.selectedMeals) {
        if (!daySelections[mealType]) {
          return false
        }
      }

      // Check snacks
      for (let i = 1; i <= preferences.snacksPerDay; i++) {
        if (!daySelections[`snack${i}`]) {
          return false
        }
      }
    }
    return true
  }

  const handleContinue = () => {
    if (validateSelections()) {
      onNext({ selections }, meals)
    }
  }

  const canContinue = validateSelections()

  // Calculate progress
  const totalRequired = preferences.deliveryDays.length * 
    (preferences.selectedMeals.length + preferences.snacksPerDay)
  
  const totalSelected = Object.values(selections).reduce((sum, daySelections) => {
    return sum + Object.keys(daySelections).filter(key => daySelections[key]).length
  }, 0)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Build Your Menu</CardTitle>
          <CardDescription>Select meals for each delivery day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-fitnest-green mb-4" />
            <p className="text-gray-500">Loading meals...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Build Your Menu</CardTitle>
          <CardDescription>Select meals for each delivery day</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Build Your Menu</CardTitle>
              <CardDescription>
                Select your preferred meals for each delivery day
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-fitnest-green">
                {totalSelected}/{totalRequired}
              </div>
              <div className="text-xs text-gray-500">meals selected</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-fitnest-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${(totalSelected / totalRequired) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">
              {preferences.deliveryDays.length} delivery days • {preferences.selectedMeals.length} meals + {preferences.snacksPerDay} snacks per day
            </p>
            {canContinue && (
              <p className="text-green-600 font-medium">✓ Ready to continue</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Day by Day Selection */}
      <div className="space-y-3">
        {preferences.deliveryDays
          .sort((a, b) => a.getTime() - b.getTime())
          .map(day => (
            <DayMealSelector
              key={formatDateYMD(day)}
              day={day}
              mealTypes={preferences.selectedMeals}
              availableMeals={mealsByType}
              selections={selections[formatDateYMD(day)] || {}}
              onMealSelect={(mealType, mealId) => handleMealSelect(day, mealType, mealId)}
              snacksPerDay={preferences.snacksPerDay}
            />
          ))}
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              size="lg"
              className="font-bold px-8 py-6 rounded-xl border-2 hover:bg-gray-50"
            >
              <span>Back</span>
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50"
              size="lg"
            >
              <span>Continue to Review</span>
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
