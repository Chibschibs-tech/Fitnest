"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MealPlan } from "./types"
import { SelectMealPlan } from "./steps/selectMealPlan"
import { cn } from "@/lib/utils"

export function OrderFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null)

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/meal-plans')
    } else {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handlePlanSelected = (plan: MealPlan) => {
    setSelectedPlan(plan)
    setCurrentStep(2)
    // Next step will be implemented next
    console.log('Selected plan:', plan)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="mb-4 hover:bg-gray-100"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {currentStep === 1 ? 'Back to Meal Plans' : 'Back'}
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Your Order
            </h1>
            <p className="text-gray-600 mt-2">
              Step {currentStep} of 4
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="hidden md:flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-2 w-16 rounded-full transition-colors",
                  step <= currentStep ? "bg-fitnest-green" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 gap-8">
        {currentStep === 1 && (
          <SelectMealPlan 
            onNext={handlePlanSelected}
          />
        )}
        
        {currentStep === 2 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Step 2 - Coming next...</p>
          </div>
        )}
      </div>
    </div>
  )
}
