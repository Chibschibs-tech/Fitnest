"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import type { Meal } from "../page"

interface MealDetailProps {
  meal: Meal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToMeals?: () => void
}

export function MealDetail({ meal, open, onOpenChange, onAddToMeals }: MealDetailProps) {
  if (!meal) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{meal.name}</SheetTitle>
          <SheetDescription className="text-base">
            {meal.sku}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          {/* Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={meal.image || "/placeholder.svg"}
              alt={meal.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed">{meal.description}</p>
          </div>

          {/* Nutrition Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Nutrition Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg text-center border border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">Calories</div>
                <div className="text-2xl font-bold text-gray-900">{meal.calories}</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg text-center border border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">Protein</div>
                <div className="text-2xl font-bold text-gray-900">{meal.protein}g</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg text-center border border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">Carbs</div>
                <div className="text-2xl font-bold text-gray-900">{meal.carbohydrates}g</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg text-center border border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">Fat</div>
                <div className="text-2xl font-bold text-gray-900">{meal.fats}g</div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
