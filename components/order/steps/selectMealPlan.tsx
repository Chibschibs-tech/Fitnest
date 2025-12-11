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
                  "relative flex flex-col rounded-lg border-2 bg-white p-4 text-left transition-all hover:shadow-md",
                  isSelected 
                    ? "border-fitnest-green shadow-md ring-2 ring-fitnest-green ring-opacity-50" 
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 h-6 w-6 bg-fitnest-green rounded-full flex items-center justify-center z-10">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Plan Image */}
                <div className="relative h-40 w-full overflow-hidden rounded-md bg-gray-100 mb-4">
                  <Image
                    src={plan.image}
                    alt={plan.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Plan Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing Preview */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-500">Starting from</span>
                    <span className="text-lg font-bold text-fitnest-green">
                      {Math.min(
                        plan.breakfast_price_per_day,
                        plan.lunch_price_per_day,
                        plan.dinner_price_per_day
                      ).toFixed(2)} MAD
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">per day</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedPlanId}
            className="bg-fitnest-green hover:bg-fitnest-green/90"
            size="lg"
          >
            Continue to Meal Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
