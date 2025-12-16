"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BuildMenu } from "./steps/BuildMenu"
import { ReviewAndConfirm } from "./steps/ReviewAndConfirm"
import { MealPlan, OrderPreferences, MenuBuildData, OrderData, Meal } from "./types"
import { SelectMealPlan } from "./steps/selectMealPlan"
import { SelectPreferences } from "./steps/selectPreferences"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'

// Helper function to format date as Y-m-d
const formatDateYMD = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function OrderFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null)
  const [preferences, setPreferences] = useState<OrderPreferences | null>(null)
  const [menuData, setMenuData] = useState<MenuBuildData | null>(null)
  const [meals, setMeals] = useState<Meal[]>([])

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

  const handleMenuBuilt = (data: MenuBuildData, fetchedMeals: Meal[]) => {
    setMenuData(data)
    setMeals(fetchedMeals)
    setCurrentStep(4)
  }

  const handleOrderSubmit = async (orderData: OrderData) => {
    try {
      // Convert menu_selections keys from ISO to Y-m-d format
      const formattedSelections: { [key: string]: any } = {}
      if (menuData?.selections) {
        Object.entries(menuData.selections).forEach(([isoKey, value]) => {
          const date = new Date(isoKey)
          const ymdKey = formatDateYMD(date)
          formattedSelections[ymdKey] = value
        })
      }

      // Calculate total price
      let totalPrice = 0
      if (selectedPlan && preferences) {
        preferences.selectedMeals.forEach(mealType => {
          const priceKey = `${mealType}_price_per_day` as keyof MealPlan
          totalPrice += (selectedPlan[priceKey] as number) * preferences.deliveryDays.length
        })
        totalPrice += selectedPlan.snack_price_per_day * preferences.snacksPerDay * preferences.deliveryDays.length
      }

      // Prepare the order payload
      const payload = {
        meal_plan_id: selectedPlan?.id,
        contact_name: orderData.contactInfo.name,
        contact_email: orderData.contactInfo.email,
        contact_phone: orderData.contactInfo.phone,
        delivery_address: {
          street: orderData.address.street,
          city: orderData.address.city,
          state: orderData.address.state,
          zip_code: orderData.address.zipCode,
          country: orderData.address.country,
          additional_info: orderData.address.additionalInfo,
        },
        preferences: {
          meals: preferences?.selectedMeals,
          snacks_per_day: preferences?.snacksPerDay,
          duration_weeks: preferences?.duration,
        },
        delivery_days: preferences?.deliveryDays.map(d => formatDateYMD(d)),
        menu_selections: formattedSelections,
        total_price: totalPrice,
      }

      console.log('Order payload:', { ...payload, total_price: totalPrice })

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const result = await response.json()
      
      // Redirect to success page or order confirmation
      router.push(`/order/success?orderId=${result.id || result.data?.id}`)
    } catch (error) {
      console.error('Order submission error:', error)
      throw error
    }
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
            onNext={(menuData: MenuBuildData, fetchedMeals: Meal[]) => handleMenuBuilt(menuData, fetchedMeals)}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && selectedPlan && preferences && menuData && meals && (
          <ReviewAndConfirm
            selectedPlan={selectedPlan}
            preferences={preferences}
            menuData={menuData}
            meals={meals}
            onSubmit={handleOrderSubmit}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  )
}
