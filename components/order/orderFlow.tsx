"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Check, ClipboardList, Settings, UtensilsCrossed, ShoppingCart } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BuildMenu } from "./steps/BuildMenu"
import { ReviewAndConfirm } from "./steps/ReviewAndConfirm"
import { MealPlan, OrderPreferences, MenuBuildData, OrderData, Meal } from "./types"
import { SelectMealPlan } from "./steps/selectMealPlan"
import { SelectPreferences } from "./steps/selectPreferences"
import { PendingOrderSummary } from "./PendingOrderSummary"

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
  const searchParams = useSearchParams()
  const planId = searchParams.get('planId')
  
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

  const steps = [
    { number: 1, title: 'Choisissez un Meal Plan', icon: ClipboardList },
    { number: 2, title: 'Personnalisez votre Plan', icon: Settings },
    { number: 3, title: 'Construisez votre Menu', icon: UtensilsCrossed },
    { number: 4, title: 'Confirmation', icon: ShoppingCart }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="mb-6 hover:bg-gray-100 rounded-xl font-semibold group"
          >
            <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            {currentStep === 1 ? 'Retour aux Meal Plans' : 'Retour'}
          </Button>

          {/* Title and Step Counter */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-fitnest-green/10 rounded-full px-4 py-2 mb-4">
              <div className="bg-fitnest-green rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                {currentStep}
              </div>
              <span className="text-sm font-semibold text-fitnest-green">
                Étape {currentStep} de 4
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h1>
            <p className="text-gray-600 text-base md:text-lg font-medium">
              Complétez cette étape pour continuer votre commande
            </p>
          </div>

          {/* Progress Steps - Desktop */}
          <div className="hidden lg:flex items-center justify-center gap-3 mb-8">
            {steps.map((step, index) => {
              const isCompleted = step.number < currentStep
              const isCurrent = step.number === currentStep
              const Icon = step.icon
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-500 border-2",
                        isCompleted && "bg-gradient-to-br from-fitnest-green to-fitnest-green/80 border-fitnest-green shadow-lg scale-100",
                        isCurrent && "bg-gradient-to-br from-fitnest-orange to-orange-500 border-fitnest-orange shadow-xl scale-110 animate-pulse",
                        !isCompleted && !isCurrent && "bg-white border-gray-300"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-8 w-8 text-white" strokeWidth={3} />
                      ) : (
                        <Icon 
                          className={cn(
                            "h-8 w-8",
                            isCurrent ? "text-white" : "text-gray-400"
                          )} 
                        />
                      )}
                    </div>
                    <span 
                      className={cn(
                        "mt-3 text-sm font-semibold text-center max-w-[100px]",
                        (isCompleted || isCurrent) ? "text-gray-900" : "text-gray-500"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex items-center mx-4 mb-8">
                      <div 
                        className={cn(
                          "h-1 w-16 rounded-full transition-all duration-500",
                          step.number < currentStep ? "bg-fitnest-green" : "bg-gray-300"
                        )} 
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress Bar - Mobile/Tablet */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className={cn(
                  "h-2 flex-1 max-w-[80px] rounded-full transition-all duration-500",
                  step.number < currentStep && "bg-fitnest-green",
                  step.number === currentStep && "bg-fitnest-orange scale-105",
                  step.number > currentStep && "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 animate-in fade-in duration-500">
            {currentStep === 1 && (
              <SelectMealPlan 
                onNext={handlePlanSelected}
                initialSelectedId={planId || undefined}
              />
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

          {/* Pending Order Summary Sidebar - Only for Steps 2, 3, 4 */}
          {currentStep >= 2 && currentStep <= 4 && selectedPlan && (
            <div className="lg:col-span-1">
              <PendingOrderSummary
                step={currentStep as 2 | 3 | 4}
                selectedPlan={selectedPlan}
                preferences={preferences || undefined}
                menuData={menuData || undefined}
                meals={meals}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
