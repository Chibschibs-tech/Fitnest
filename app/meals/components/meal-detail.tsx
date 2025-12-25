"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Flame, Beef, Wheat, Droplet, Sparkles } from "lucide-react"
import type { Meal } from "@/lib/api/home"

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
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto border-l-2">
        <SheetHeader className="space-y-3">
          <div className="inline-flex w-fit items-center gap-2 bg-fitnest-green/10 rounded-full px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-fitnest-green" />
            <span className="text-xs font-bold text-fitnest-green uppercase tracking-wide">
              {meal.sku}
            </span>
          </div>
          <SheetTitle className="text-3xl font-bold text-gray-900">{meal.name}</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-8">
          {/* Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg border border-gray-200">
            <Image
              src={meal.image || "/placeholder.svg"}
              alt={meal.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <div className="bg-fitnest-orange/10 rounded-lg p-2">
                <Sparkles className="h-4 w-4 text-fitnest-orange" />
              </div>
              About This Meal
            </h3>
            <p className="text-gray-600 leading-relaxed text-base font-medium pl-10">
              {meal.description}
            </p>
          </div>

          {/* Nutrition Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <div className="bg-fitnest-green/10 rounded-lg p-2">
                <Flame className="h-4 w-4 text-fitnest-green" />
              </div>
              Nutrition Facts
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="group relative bg-white border-2 border-gray-200 hover:border-fitnest-orange p-4 rounded-2xl text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-fitnest-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-fitnest-orange/10 mb-2 group-hover:scale-110 transition-transform">
                    <Flame className="h-5 w-5 text-fitnest-orange" />
                  </div>
                  <div className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Calories</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-fitnest-orange to-orange-500 bg-clip-text text-transparent">
                    {meal.calories}
                  </div>
                </div>
              </div>
              
              <div className="group relative bg-white border-2 border-gray-200 hover:border-fitnest-green p-4 rounded-2xl text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-fitnest-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-fitnest-green/10 mb-2 group-hover:scale-110 transition-transform">
                    <Beef className="h-5 w-5 text-fitnest-green" />
                  </div>
                  <div className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Protein</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-fitnest-green to-emerald-600 bg-clip-text text-transparent">
                    {meal.protein}g
                  </div>
                </div>
              </div>
              
              <div className="group relative bg-white border-2 border-gray-200 hover:border-fitnest-orange p-4 rounded-2xl text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-fitnest-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-fitnest-orange/10 mb-2 group-hover:scale-110 transition-transform">
                    <Wheat className="h-5 w-5 text-fitnest-orange" />
                  </div>
                  <div className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Carbs</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-fitnest-orange to-orange-500 bg-clip-text text-transparent">
                    {meal.carbohydrates}g
                  </div>
                </div>
              </div>
              
              <div className="group relative bg-white border-2 border-gray-200 hover:border-fitnest-green p-4 rounded-2xl text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-fitnest-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-fitnest-green/10 mb-2 group-hover:scale-110 transition-transform">
                    <Droplet className="h-5 w-5 text-fitnest-green" />
                  </div>
                  <div className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Fat</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-fitnest-green to-emerald-600 bg-clip-text text-transparent">
                    {meal.fats}g
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
