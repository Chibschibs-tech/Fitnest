"use client"

import { format } from "date-fns"
import { Check, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { Meal } from "./types"
import { MealCard } from "./MealCard"

interface DayMealSelectorProps {
  day: Date
  mealTypes: string[]
  availableMeals: {
    [mealType: string]: Meal[]
  }
  selections: {
    [mealType: string]: string | undefined
  }
  onMealSelect: (mealType: string, mealId: string) => void
  snacksPerDay: number
}

export function DayMealSelector({
  day,
  mealTypes,
  availableMeals,
  selections,
  onMealSelect,
  snacksPerDay,
}: DayMealSelectorProps) {
  // Check if all meals for this day are selected
  const requiredMealTypes = [...mealTypes]
  if (snacksPerDay > 0) {
    for (let i = 1; i <= snacksPerDay; i++) {
      requiredMealTypes.push(`snack${i}`)
    }
  }
  
  const isComplete = requiredMealTypes.every(type => selections[type])

  return (
    <Collapsible defaultOpen className="border rounded-lg bg-white">
      <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            isComplete ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          )}>
            {format(day, 'd')}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-sm">{format(day, 'EEEE, MMM d')}</h3>
            <p className="text-xs text-gray-500">
              {isComplete ? (
                <span className="text-green-600 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  All meals selected
                </span>
              ) : (
                `${Object.keys(selections).filter(k => selections[k]).length}/${requiredMealTypes.length} meals selected`
              )}
            </p>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="p-4 pt-0 space-y-6">
          {/* Main Meals */}
          {mealTypes.map(mealType => (
            <div key={mealType}>
              <h4 className="font-medium text-sm mb-3 capitalize flex items-center gap-2">
                {mealType}
                {selections[mealType] && (
                  <span className="text-xs text-green-600 font-normal">✓ Selected</span>
                )}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableMeals[mealType]?.map(meal => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    isSelected={selections[mealType] === meal.id}
                    onSelect={() => onMealSelect(mealType, meal.id)}
                  />
                ))}
                {(!availableMeals[mealType] || availableMeals[mealType].length === 0) && (
                  <div className="col-span-full text-center py-6 text-sm text-gray-500 border rounded-lg border-dashed">
                    No {mealType} meals available
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Snacks */}
          {snacksPerDay > 0 && (
            <>
              {Array.from({ length: snacksPerDay }).map((_, index) => {
                const snackKey = `snack${index + 1}`
                return (
                  <div key={snackKey}>
                    <h4 className="font-medium text-sm mb-3 capitalize flex items-center gap-2">
                      Snack {index + 1}
                      {selections[snackKey] && (
                        <span className="text-xs text-green-600 font-normal">✓ Selected</span>
                      )}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {availableMeals.snack?.map(meal => (
                        <MealCard
                          key={meal.id}
                          meal={meal}
                          isSelected={selections[snackKey] === meal.id}
                          onSelect={() => onMealSelect(snackKey, meal.id)}
                        />
                      ))}
                      {(!availableMeals.snack || availableMeals.snack.length === 0) && (
                        <div className="col-span-full text-center py-6 text-sm text-gray-500 border rounded-lg border-dashed">
                          No snack meals available
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
