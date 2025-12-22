"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Meal } from "@/app/meals/page"

interface MealCardProps {
  meal: Meal
  isSelected?: boolean
  onSelect: () => void
}

export function MealCard({ meal, isSelected, onSelect }: MealCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative flex flex-col rounded-lg border-2 bg-white text-left transition-all",
        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-fitnest-green",
        isSelected 
          ? "border-fitnest-green shadow-md ring-2 ring-fitnest-green ring-opacity-50" 
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 h-6 w-6 bg-fitnest-green rounded-full flex items-center justify-center z-10 shadow-md">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Meal Image */}
      <div className="relative h-32 w-full overflow-hidden rounded-t-md bg-gray-100">
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Meal Info */}
      <div className="p-3 flex-1">
        <h4 className="font-semibold text-sm mb-1 line-clamp-2">{meal.name}</h4>
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
          {meal.description}
        </p>

        {/* Nutrition Info */}
        <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-500">
          <div>
            <span className="font-medium">{meal.calories}</span> cal
          </div>
          <div>
            <span className="font-medium">{meal.protein}g</span> protein
          </div>
          <div>
            <span className="font-medium">{meal.carbohydrates}g</span> carbs
          </div>
          <div>
            <span className="font-medium">{meal.fats}g</span> fat
          </div>
        </div>
      </div>
    </button>
  )
}
