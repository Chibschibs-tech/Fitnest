"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Meal } from "../page"

interface MealCardProps {
  meal: Meal
  onViewDetails: (meal: Meal) => void
}

export function MealCard({ meal, onViewDetails }: MealCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group border border-gray-200 hover:border-gray-300">
      <div className="relative h-48 overflow-hidden flex-shrink-0 bg-gray-100">
        <Image
          src={meal.image || "/placeholder.svg"}
          alt={meal.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      </div>
      <CardContent className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-gray-900 group-hover:text-green-600 transition-colors">
          {meal.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {meal.description}
        </p>
        <div className="grid grid-cols-4 gap-3 text-sm pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs mb-0.5">Protein</span>
            <span className="font-medium text-gray-900">{Math.round(meal.protein)}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs mb-0.5">Carbs</span>
            <span className="font-medium text-gray-900">{Math.round(meal.carbohydrates)}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs mb-0.5">Fat</span>
            <span className="font-medium text-gray-900">{Math.round(meal.fats)}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs mb-0.5">Calories</span>
            <span className="font-medium text-gray-900">{Math.round(meal.calories)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex justify-start flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(meal)}
          className="text-green-600 text-green-700 hover:text-green-900 hover:bg-green-40 bg-green-50 font-medium transition-all"
        >
          Description
        </Button>
      </CardFooter>
    </Card>
  )
}
