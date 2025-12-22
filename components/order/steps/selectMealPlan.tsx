"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useMealPlans } from "../hooks/useMealPlans"
import { MealPlan } from "../types"

interface SelectMealPlanProps {
  onNext: (selectedPlan: MealPlan) => void
  initialSelectedId?: string
}

export function SelectMealPlan({ onNext, initialSelectedId }: SelectMealPlanProps) {
  const { mealPlans, isLoading, error } = useMealPlans()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(initialSelectedId || null)

  const handleContinue = () => {
    const selectedPlan = mealPlans.find(plan => plan.id === selectedPlanId)
    if (selectedPlan) {
      onNext(selectedPlan)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Meal Plan</CardTitle>
          <CardDescription>Select the perfect meal plan for your goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-fitnest-green mb-4" />
            <p className="text-gray-500">Loading meal plans...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Meal Plan</CardTitle>
          <CardDescription>Select the perfect meal plan for your goals</CardDescription>
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

  if (mealPlans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Meal Plan</CardTitle>
          <CardDescription>Select the perfect meal plan for your goals</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Plans Available</AlertTitle>
            <AlertDescription>
              There are no active meal plans available at the moment. Please check back later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Meal Plan</CardTitle>
        <CardDescription>
          Select the perfect meal plan tailored to your fitness goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mealPlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id
            
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  "group relative flex flex-col rounded-3xl border-2 bg-white p-6 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
                  isSelected 
                    ? "border-fitnest-green shadow-xl ring-4 ring-fitnest-green/20 scale-105" 
                    : "border-gray-200 hover:border-fitnest-green/50"
                )}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 h-8 w-8 bg-gradient-to-br from-fitnest-green to-fitnest-green/80 rounded-full flex items-center justify-center z-10 shadow-lg animate-in zoom-in duration-300">
                    <Check className="h-5 w-5 text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Plan Image */}
                <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-md">
                  <Image
                    src={plan.image}
                    alt={plan.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Plan Info */}
                <div className="flex-1 space-y-3">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-fitnest-green transition-colors">{plan.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing Preview */}
                <div className="mt-4 p-4 bg-gradient-to-br from-fitnest-green/5 to-fitnest-orange/5 rounded-2xl border border-fitnest-green/10">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">From</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                      {Math.min(
                        plan.breakfast_price_per_day,
                        plan.lunch_price_per_day,
                        plan.dinner_price_per_day
                      ).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-600 font-medium">MAD/day</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-end pt-6">
          <Button
            onClick={handleContinue}
            disabled={!selectedPlanId}
            className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            <span>Continue to Preferences</span>
            <Check className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
