"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BuildMenu } from "./steps/BuildMenu"
import { SelectMealPlan } from "./steps/selectMealPlan"
import { SelectPreferences } from "./steps/selectPreferences"
import type { MealPlan, OrderPreferences, MenuBuildData } from "./types"

export function OrderFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null)
  const [preferences, setPreferences] = useState<OrderPreferences | null>(null)
  const [menuData, setMenuData] = useState<MenuBuildData | null>(null)

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
  }

  const handlePreferencesSelected = (prefs: OrderPreferences) => {
    setPreferences(prefs)
    setCurrentStep(3)
  }

  const handleMenuBuilt = (data: MenuBuildData) => {
    setMenuData(data)
    setCurrentStep(4)
    console.log('Menu built:', data)
    // Next: Review & Confirm step
  }

  const stepTitles = [
    'Choose Meal Plan',
    'Customize Preferences',
    'Build Your Menu',
    'Review & Confirm'
  ]

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
              {stepTitles[currentStep - 1]}
            </h1>
            <p className="text-gray-600 mt-2">
              Step {currentStep} of 4
            </p>
          </div>

          {/* Progress Bar */}
          <div className="hidden md:flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-2 w-20 rounded-full transition-all duration-300",
                  step < currentStep && "bg-fitnest-green",
                  step === currentStep && "bg-fitnest-green animate-pulse",
                  step > currentStep && "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="animate-in fade-in duration-300">
        {currentStep === 1 && (
          <SelectMealPlan onNext={handlePlanSelected} />
        )}
        
        {currentStep === 2 && selectedPlan && (
          <SelectPreferences 
            selectedPlan={selectedPlan}
            onNext={handlePreferencesSelected}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && selectedPlan && preferences && (
          <BuildMenu
            selectedPlan={selectedPlan}
            preferences={preferences}
            onNext={handleMenuBuilt}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Step 4 - Review & Confirm - Coming next...</p>
          </div>
        )}
      </div>
    </div>
  )
}
