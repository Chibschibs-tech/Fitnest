"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { format, addDays, isBefore, isAfter, startOfWeek, startOfDay, getWeek, getYear } from "date-fns"
import { ChevronLeft, Info, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { DeliveryCalendar } from "@/components/delivery-calendar"
import { calculatePrice, type MealSelection, type PriceBreakdown, formatPrice } from "@/lib/pricing-model"

// Extended Meal interface with meal_type
interface MealWithType {
  id: string
  name: string
  description: string
  image: string
  sku: string
  calories: number
  protein: number
  carbohydrates: number
  fats: number
  status: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  updated_at: string
  created_at: string
}

interface MealPlan {
  id: string
  breakfast_price_per_day: number
  created_at: string
  description: string
  dinner_price_per_day: number
  image: string
  lunch_price_per_day: number
  meals: string
  name: string
  sku: string
  snack_price_per_day: number
  status: string
  updated_at: string
}

const mealTypes = [
  { id: "breakfast", label: "Breakfast", description: "Start your day right" },
  { id: "lunch", label: "Lunch", description: "Midday energy boost" },
  { id: "dinner", label: "Dinner", description: "Evening nourishment" },
]

const snackOptions = [
  { id: "0-snacks", label: "No Snacks", description: "No additional snacks", value: 0 },
  { id: "1-snack", label: "1 Snack / Day", description: "One healthy snack per day", value: 1 },
  { id: "2-snacks", label: "2 Snacks / Day", description: "Two healthy snacks per day", value: 2 },
]

const durationOptions = [
  { value: 1, label: "1 Week", weeks: 1 },
  { value: 2, label: "2 Weeks", weeks: 2 },
  { value: 4, label: "1 Month", weeks: 4 },
]

// Helper function to group dates by week
function groupDatesByWeek(dates: Date[]): Record<string, Date[]> {
  const weeks: Record<string, Date[]> = {}

  dates.forEach((date) => {
    const year = getYear(date)
    const week = getWeek(date, { weekStartsOn: 1 }) // Monday start
    const weekKey = `${year}-W${week}`

    if (!weeks[weekKey]) {
      weeks[weekKey] = []
    }
    weeks[weekKey].push(date)
  })

  return weeks
}

// Validation function for delivery days based on duration
function validateDeliveryDays(selectedDays: Date[], duration: number): string[] {
  const errors: string[] = []
  const totalDays = selectedDays.length

  if (duration === 1) {
    // 1 week: at least 3 days
    if (totalDays < 3) {
      errors.push("Please select at least 3 delivery days for a 1-week subscription")
    }
  } else if (duration === 2) {
    // 2 weeks: at least 6 days total with at least 2 days in the second week
    if (totalDays < 6) {
      errors.push("Please select at least 6 delivery days for a 2-week subscription")
    } else {
      const weekGroups = groupDatesByWeek(selectedDays)
      const weeks = Object.keys(weekGroups).sort()

      if (weeks.length < 2) {
        errors.push("Please select delivery days across both weeks")
      } else {
        const secondWeekDays = weekGroups[weeks[1]]?.length || 0
        if (secondWeekDays < 2) {
          errors.push("Please select at least 2 delivery days in the second week")
        }
      }
    }
  } else if (duration === 4) {
    // 1 month: at least 10 days total with at least 2 days in the second, third, and fourth weeks
    if (totalDays < 10) {
      errors.push("Please select at least 10 delivery days for a 1-month subscription")
    } else {
      const weekGroups = groupDatesByWeek(selectedDays)
      const weeks = Object.keys(weekGroups).sort()

      if (weeks.length < 4) {
        errors.push("Please select delivery days across all 4 weeks")
      } else {
        // Check weeks 2, 3, and 4 have at least 2 days each
        for (let i = 1; i < 4; i++) {
          const weekDays = weekGroups[weeks[i]]?.length || 0
          if (weekDays < 2) {
            errors.push(`Please select at least 2 delivery days in week ${i + 1}`)
            break
          }
        }
      }
    }
  }

  return errors
}

// Helper to infer meal type from meal name as fallback
function inferMealType(mealName: string): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
  const nameLower = mealName.toLowerCase()
  
  if (nameLower.includes('breakfast') || nameLower.includes('pancake') || 
      nameLower.includes('oats') || nameLower.includes('omelette')) {
    return 'breakfast'
  }
  
  if (nameLower.includes('snack') || nameLower.includes('bar') || 
      nameLower.includes('smoothie')) {
    return 'snack'
  }
  
  if (nameLower.includes('dinner')) {
    return 'dinner'
  }
  
  // Default to lunch for unknown meals
  return 'lunch'
}

export function OrderProcess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planIdFromUrl = searchParams.get("plan")

  // Fetch meal plans from API
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    planIdFromUrl ? planIdFromUrl || null : null,
  )
  const selectedPlan = mealPlans.find((p) => p.id === selectedPlanId) || null

  // Fetch meals for selected plan
  const [planMeals, setPlanMeals] = useState<MealWithType[]>([])
  const [loadingMeals, setLoadingMeals] = useState(false)

  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>(["lunch", "dinner"])
  const [selectedSnacks, setSelectedSnacks] = useState("0-snacks")
  const [duration, setDuration] = useState(1) // Default to 1 week
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [selectedDays, setSelectedDays] = useState<Date[]>([])
  const [promoCode, setPromoCode] = useState("")

  // Client information state
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")

  const [step, setStep] = useState(1)
  const [menuSelections, setMenuSelections] = useState<Record<string, Record<string, any>>>({})
  const [errors, setErrors] = useState<{
    mealPlan?: string
    mealTypes?: string
    days?: string
    menu?: string
    clientName?: string
    clientEmail?: string
    clientPhone?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pricing calculation state
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null)
  const [pricingError, setPricingError] = useState<string>("")

  // Fetch meal plans on mount using the same endpoint as meal-plans page
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        setLoadingPlans(true)
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
        const response = await fetch(`${API_BASE}/meal-plans?status=active`, {
          cache: 'no-store',
        })
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("✅ Fetched meal plans data:", data)
        
        // Handle different API response structures (same as meal-plans page)
        let fetchedPlans: MealPlan[] = []
        if (Array.isArray(data.data)) {
          fetchedPlans = data.data
        } else if (Array.isArray(data)) {
          fetchedPlans = data
        } else if (data.mealPlans && Array.isArray(data.mealPlans)) {
          fetchedPlans = data.mealPlans
        } else if (data.success && data.mealPlans && Array.isArray(data.mealPlans)) {
          fetchedPlans = data.mealPlans
        }
        
        // Transform API response to match our MealPlan interface
        const transformedPlans: MealPlan[] = fetchedPlans.map((plan: any) => ({
          id: String(plan.id),
          breakfast_price_per_day: Number(plan.breakfast_price_per_day) || 0,
          created_at: plan.created_at || new Date().toISOString(),
          description: plan.description || '',
          dinner_price_per_day: Number(plan.dinner_price_per_day) || 0,
          image: plan.image || plan.image_url || '/placeholder.svg',
          lunch_price_per_day: Number(plan.lunch_price_per_day) || 0,
          meals: plan.meals || '',
          name: plan.name || '',
          sku: plan.sku || '',
          snack_price_per_day: Number(plan.snack_price_per_day) || 0,
          status: plan.status || 'active',
          updated_at: plan.updated_at || new Date().toISOString(),
        }))
        
        console.log(`✅ Processed ${transformedPlans.length} meal plans`)
        setMealPlans(transformedPlans)
        
        // If planIdFromUrl is provided, try to find matching plan
        if (planIdFromUrl && !selectedPlanId) {
          const plan = transformedPlans.find(
            (p: MealPlan) => p.id === planIdFromUrl,
          )
          if (plan) {
            setSelectedPlanId(plan.id)
            console.log(`✅ Auto-selected plan from URL: ${plan.name}`)
          }
        }
      } catch (error) {
        console.error("❌ Error fetching meal plans:", error)
      } finally {
        setLoadingPlans(false)
      }
    }
    fetchMealPlans()
  }, [planIdFromUrl])

  // Fetch meals when meal plan is selected and we're on step 2
  useEffect(() => {
    const fetchPlanMeals = async () => {
      if (!selectedPlanId || step !== 2) return

      try {
        setLoadingMeals(true)
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
        
        console.log(`🔄 Fetching meals for plan ID: ${selectedPlanId}`)
        
        // First, try to get meals from the meal plan endpoint
        try {
          const planResponse = await fetch(`${API_BASE}/meal-plans/${selectedPlanId}`, {
            cache: 'no-store',
          })
          
          if (planResponse.ok) {
            const planData = await planResponse.json()
            if (planData.meals && Array.isArray(planData.meals)) {
              const transformedMeals: MealWithType[] = planData.meals.map((meal: any) => ({
                id: String(meal.id),
                name: meal.name,
                description: meal.description || '',
                image: meal.image || meal.imageUrl || meal.image_url || '/placeholder.svg',
                sku: meal.sku || '',
                calories: meal.calories || meal.nutrition?.calories || 0,
                protein: meal.protein || meal.nutrition?.protein || 0,
                carbohydrates: meal.carbs || meal.carbohydrates || meal.nutrition?.carbs || 0,
                fats: meal.fat || meal.fats || meal.nutrition?.fat || 0,
                status: meal.status || 'active',
                // FIXED: Use meal_type from API or infer from name
                meal_type: meal.meal_type || meal.mealType || inferMealType(meal.name),
                updated_at: meal.updated_at || new Date().toISOString(),
                created_at: meal.created_at || new Date().toISOString(),
              }))
              
              console.log(`✅ Loaded ${transformedMeals.length} meals from plan endpoint`)
              setPlanMeals(transformedMeals)
              setLoadingMeals(false)
              return
            }
          }
        } catch (planError) {
          console.log("⚠️ Meal plan endpoint failed, trying meals endpoint:", planError)
        }
        
        // Fallback: fetch all meals
        const mealsResponse = await fetch(`${API_BASE}/meals?status=active`, {
          cache: 'no-store',
        })
        
        if (mealsResponse.ok) {
          const mealsData = await mealsResponse.json()
          const fetchedMeals: any[] = Array.isArray(mealsData.data) ? mealsData.data : 
                                       Array.isArray(mealsData) ? mealsData : []
          
          const transformedMeals: MealWithType[] = fetchedMeals.map((meal: any) => ({
            id: String(meal.id),
            name: meal.name,
            description: meal.description || '',
            image: meal.image || meal.imageUrl || meal.image_url || '/placeholder.svg',
            sku: meal.sku || '',
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            carbohydrates: meal.carbohydrates || meal.carbs || 0,
            fats: meal.fats || meal.fat || 0,
            status: meal.status || 'active',
            // FIXED: Use meal_type from API or infer from name
            meal_type: meal.meal_type || meal.mealType || inferMealType(meal.name),
            updated_at: meal.updated_at || new Date().toISOString(),
            created_at: meal.created_at || new Date().toISOString(),
          }))
          
          console.log(`✅ Loaded ${transformedMeals.length} meals from meals endpoint`)
          setPlanMeals(transformedMeals)
        }
      } catch (error) {
        console.error("❌ Error fetching plan meals:", error)
      } finally {
        setLoadingMeals(false)
      }
    }
    
    fetchPlanMeals()
  }, [selectedPlanId, step])

  // Calendar rules
  const today = new Date()
  const weekStartsOn = 1 as const // Monday
  const allowedWeeks = duration === 1 ? 2 : duration === 2 ? 3 : duration === 4 ? 5 : 4
  const allowedStart = startOfWeek(today, { weekStartsOn })
  const allowedEnd = addDays(allowedStart, allowedWeeks * 7 - 1)
  const todayStart = startOfDay(today)

  const sortedSelectedDays = [...selectedDays].sort((a, b) => a.getTime() - b.getTime())
  const startDate = sortedSelectedDays.length > 0 ? sortedSelectedDays[0] : undefined

  // FIXED: Group meals by meal type using actual field instead of string matching
  const mealsByType: Record<string, MealWithType[]> = useMemo(() => {
    const categorized = {
      breakfast: planMeals.filter((meal) => meal.meal_type === 'breakfast'),
      lunch: planMeals.filter((meal) => meal.meal_type === 'lunch'),
      dinner: planMeals.filter((meal) => meal.meal_type === 'dinner'),
      snack: planMeals.filter((meal) => meal.meal_type === 'snack'),
    }
    
    // Debug logging
    if (planMeals.length > 0) {
      console.log('📊 Meal Distribution:', {
        total: planMeals.length,
        breakfast: categorized.breakfast.length,
        lunch: categorized.lunch.length,
        dinner: categorized.dinner.length,
        snack: categorized.snack.length,
      })
    }
    
    return categorized
  }, [planMeals])

  // Calculate pricing whenever selection changes
  useEffect(() => {
    if (selectedPlanId && selectedDays.length >= 3) {
      try {
        const selection: MealSelection = {
          planId: selectedPlanId || "",
          mainMeals: selectedMealTypes.includes("lunch") && selectedMealTypes.includes("dinner") ? 2 : 1,
          breakfast: selectedMealTypes.includes("breakfast"),
          snacks: snackOptions.find((opt) => opt.id === selectedSnacks)?.value || 0,
          selectedDays: selectedDays,
          subscriptionWeeks: durationOptions.find((opt) => opt.value === duration)?.weeks || 1,
          promoCode: promoCode || undefined,
        }

        const breakdown = calculatePrice(selection, promoCode || undefined)
        setPriceBreakdown(breakdown)
        setPricingError("")
      } catch (error) {
        setPricingError(error instanceof Error ? error.message : "Pricing calculation error")
        setPriceBreakdown(null)
      }
    }
  }, [selectedPlanId, selectedMealTypes, selectedSnacks, selectedDays, duration, promoCode])

  // Reset selected days if duration changes and selected days fall outside the new range
  useEffect(() => {
    const filteredDays = selectedDays.filter((day) => {
      const t = startOfDay(day)
      return !isBefore(t, todayStart) && !isAfter(t, allowedEnd)
    })
    if (filteredDays.length !== selectedDays.length) {
      setSelectedDays(filteredDays)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, allowedEnd, todayStart])

  // Initialize menu selections when days change
  useEffect(() => {
    const newMenuSelections: Record<string, Record<string, any>> = {}
    selectedDays.forEach((day) => {
      const dayKey = day.toISOString()
      newMenuSelections[dayKey] = {}
      selectedMealTypes.forEach((mealType) => {
        newMenuSelections[dayKey][mealType] = null
      })
      if (selectedSnacks === "1-snack") {
        newMenuSelections[dayKey]["snack1"] = null
      } else if (selectedSnacks === "2-snacks") {
        newMenuSelections[dayKey]["snack1"] = null
        newMenuSelections[dayKey]["snack2"] = null
      }
    })
    setMenuSelections(newMenuSelections)
  }, [selectedDays, selectedMealTypes, selectedSnacks])

  const handleMealTypeToggle = (mealTypeId: string) => {
    setSelectedMealTypes((prev) => {
      if (prev.includes(mealTypeId) && prev.length <= 2) return prev
      return prev.includes(mealTypeId) ? prev.filter((id) => id !== mealTypeId) : [...prev, mealTypeId]
    })
  }

  const handleAllergyToggle = (allergyId: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergyId) ? prev.filter((id) => id !== allergyId) : [...prev, allergyId],
    )
  }

  const handleMealSelection = (day: Date, mealType: string, meal: any) => {
    const dayKey = day.toISOString()
    setMenuSelections((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [mealType]: meal,
      },
    }))
  }

  const isMenuComplete = () => {
    for (const day of selectedDays) {
      const dayKey = day.toISOString()
      for (const mealType of selectedMealTypes) {
        if (!menuSelections[dayKey]?.[mealType]) return false
      }
      if (selectedSnacks === "1-snack" && !menuSelections[dayKey]?.["snack1"]) return false
      if (selectedSnacks === "2-snacks" && (!menuSelections[dayKey]?.["snack1"] || !menuSelections[dayKey]?.["snack2"]))
        return false
    }
    return selectedDays.length > 0
  }

  const validateStep = () => {
    const newErrors: typeof errors = {}
    if (step === 1) {
      if (!selectedPlanId) newErrors.mealPlan = "Please select a meal plan"
      if (selectedMealTypes.length < 2) newErrors.mealTypes = "Please select at least 2 meal types"

      const dayValidationErrors = validateDeliveryDays(selectedDays, duration)
      if (dayValidationErrors.length > 0) {
        newErrors.days = dayValidationErrors[0]
      }
    } else if (step === 2) {
      if (!isMenuComplete()) newErrors.menu = "Please select all meals for your plan"
    } else if (step === 3) {
      if (!clientName.trim()) newErrors.clientName = "Please enter your name"
      if (!clientEmail.trim()) {
        newErrors.clientEmail = "Please enter your email"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
        newErrors.clientEmail = "Please enter a valid email address"
      }
      if (!clientPhone.trim()) newErrors.clientPhone = "Please enter your phone number"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1)
        window.scrollTo(0, 0)
      } else {
        setIsSubmitting(true)
        try {
          const formattedDays = sortedSelectedDays.map((day) => format(day, "yyyy-MM-dd"))
          const mealPlanId = selectedPlanId?.toString() || ""

          const orderPayload = {
            client_name: clientName.trim(),
            client_email: clientEmail.trim(),
            client_phone: clientPhone.trim(),
            meal_plan_id: mealPlanId,
            days: formattedDays,
          }

          console.log("📤 Submitting order:", orderPayload)

          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(orderPayload),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Failed to create order" }))
            throw new Error(errorData.message || "Failed to create order")
          }

          const result = await response.json()
          console.log("✅ Order created:", result)
          
          const mealPlanData = {
            planId: selectedPlanId,
            planName: selectedPlan?.name,
            planPrice: priceBreakdown?.finalTotal || 0,
            duration: `${selectedDays.length} days`,
            subscriptionWeeks: durationOptions.find((opt) => opt.value === duration)?.weeks || 1,
            customizations: {
              dietaryRestrictions: selectedAllergies,
              mealTypes: selectedMealTypes,
              snacks: selectedSnacks,
            },
            deliverySchedule: {
              frequency: "Custom",
              selectedDays: sortedSelectedDays.map((d) => d.toISOString()),
              startDate: startDate?.toISOString(),
            },
            priceBreakdown: priceBreakdown,
            orderId: result.id || result.orderId,
          }
          localStorage.setItem("selectedMealPlan", JSON.stringify(mealPlanData))
          
          router.push(`/checkout/confirmation?orderId=${result.id || result.orderId}`)
        } catch (error) {
          console.error("❌ Error submitting order:", error)
          setErrors({
            ...errors,
            clientEmail: error instanceof Error ? error.message : "Failed to create order",
          })
        } finally {
          setIsSubmitting(false)
        }
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    } else {
      router.push("/meal-plans")
    }
  }

  const meetsMinimumRequirements = () => {
    const dayValidationErrors = validateDeliveryDays(selectedDays, duration)
    return selectedPlanId !== null && selectedMealTypes.length >= 2 && dayValidationErrors.length === 0
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {step === 1 ? "Back to Meal Plans" : "Back"}
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Customize Your Perfect Meal Plan</h1>
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full",
                step >= 1 ? "bg-fitnest-green text-white" : "bg-gray-200 text-gray-500",
              )}
            >
              1
            </div>
            <div className={cn("w-8 h-0.5", step >= 2 ? "bg-fitnest-green" : "bg-gray-200")} />
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full",
                step >= 2 ? "bg-fitnest-green text-white" : "bg-gray-200 text-gray-500",
              )}
            >
              2
            </div>
            <div className={cn("w-8 h-0.5", step >= 3 ? "bg-fitnest-green" : "bg-gray-200")} />
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full",
                step >= 3 ? "bg-fitnest-green text-white" : "bg-gray-200 text-gray-500",
              )}
            >
              3
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Plan Options</CardTitle>
                <CardDescription>Customize your meal plan to fit your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Meal Plan Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Choose your meal plan</Label>
                  {loadingPlans ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-gray-500">Loading meal plans...</p>
                    </div>
                  ) : mealPlans.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-gray-500">No meal plans available</p>
                    </div>
                  ) : (
                    <RadioGroup
                      value={selectedPlanId || ""}
                      onValueChange={(value) => {
                        console.log("✅ Meal plan selected:", value)
                        setSelectedPlanId(value)
                      }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {mealPlans.map((plan) => {
                        const isSelected = selectedPlanId === plan.id
                        return (
                          <div key={plan.id} className="relative">
                            <RadioGroupItem
                              value={plan.id}
                              id={`plan-${plan.id}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`plan-${plan.id}`}
                              className={cn(
                                "relative flex items-center space-x-4 rounded-md border-2 bg-white p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                                isSelected
                                  ? "border-fitnest-green bg-fitnest-green/5"
                                  : "border-muted hover:border-gray-200"
                              )}
                            >
                              {isSelected && (
                                <div className="absolute top-2 right-2 h-5 w-5 bg-fitnest-green rounded-full flex items-center justify-center z-10">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                              <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                                <Image
                                  src={plan.image || '/placeholder.svg'}
                                  alt={plan.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{plan.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{plan.description}</p>
                              </div>
                            </Label>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  )}
                  {errors.mealPlan && <p className="text-red-500 text-sm mt-2">{errors.mealPlan}</p>}
                </div>

                {/* Meal Types Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">How many meals per day?</Label>
                  <p className="text-sm text-gray-500 mb-4">Select a minimum of 2 meals, including lunch or dinner.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mealTypes.map((mealType) => (
                      <div key={mealType.id} className="relative">
                        <input
                          type="checkbox"
                          id={`meal-type-${mealType.id}`}
                          checked={selectedMealTypes.includes(mealType.id)}
                          onChange={() =>
                            setSelectedMealTypes((prev) =>
                              prev.includes(mealType.id)
                                ? prev.filter((id) => id !== mealType.id)
                                : [...prev, mealType.id],
                            )
                          }
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={`meal-type-${mealType.id}`}
                          className={cn(
                            "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-200 cursor-pointer",
                            selectedMealTypes.includes(mealType.id) ? "border-fitnest-green" : "",
                          )}
                        >
                          {selectedMealTypes.includes(mealType.id) && (
                            <div className="absolute top-2 right-2 h-5 w-5 bg-fitnest-green rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className="text-center">
                            <h3 className="font-semibold">{mealType.label}</h3>
                            <p className="text-sm text-gray-500">{mealType.description}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.mealTypes && <p className="text-red-500 text-sm mt-2">{errors.mealTypes}</p>}
                </div>

                {/* Snacks Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">How many snacks per day?</Label>
                  <RadioGroup
                    value={selectedSnacks}
                    onValueChange={setSelectedSnacks}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {snackOptions.map((option) => (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={`snack-${option.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`snack-${option.id}`}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-fitnest-green [&:has([data-state=checked])]:border-fitnest-green cursor-pointer"
                        >
                          <div className="text-center">
                            <h3 className="font-semibold">{option.label}</h3>
                            <p className="text-sm text-gray-500">{option.description}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Duration Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Subscription Duration</Label>
                  <RadioGroup
                    value={String(duration)}
                    onValueChange={(value) => setDuration(Number(value))}
                    className="grid gap-4 md:grid-cols-3"
                  >
                    {durationOptions.map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem
                          value={String(option.value)}
                          id={`duration-${option.value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`duration-${option.value}`}
                          className="relative flex flex-col items-center justify-center rounded-md border-2 border-muted bg-white p-4 h-full hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-fitnest-green [&:has([data-state=checked])]:border-fitnest-green cursor-pointer"
                        >
                          <h3 className="font-semibold">{option.label}</h3>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Promo Code */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Promo Code (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter promo code"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={() => setPromoCode("")} disabled={!promoCode}>
                      Clear
                    </Button>
                  </div>
                  {promoCode && priceBreakdown?.discounts.seasonalDiscount && (priceBreakdown.discounts.seasonalDiscount ?? 0) > 0 && (
                    <p className="text-green-600 text-sm mt-2">
                      ✓ Promo code applied! Save {formatPrice(priceBreakdown?.discounts.seasonalDiscount ?? 0)}
                    </p>
                  )}
                </div>

                {/* Calendar Day Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Select your delivery days</Label>
                  <p className="text-sm text-gray-500 mb-4">
                    Click on the dates you'd like to receive your meals.
                    {duration === 1 && " Select at least 3 days."}
                    {duration === 2 && " Select at least 6 days with minimum 2 days in the second week."}
                    {duration === 4 && " Select at least 10 days with minimum 2 days in weeks 2, 3, and 4."}
                  </p>
                  <DeliveryCalendar
                    allowedWeeks={allowedWeeks}
                    value={selectedDays}
                    onChange={(days) => setSelectedDays(days)}
                    className="w-full"
                  />
                  {errors.days && <p className="text-red-500 text-sm mt-2">{errors.days}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!meetsMinimumRequirements()}>
                  Continue to Menu Building
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Build Your Menu</CardTitle>
                <CardDescription>Select your meals for each day of your plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {errors.menu && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errors.menu}</AlertDescription>
                  </Alert>
                )}

                {loadingMeals ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">Loading meals...</p>
                  </div>
                ) : planMeals.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No meals available</AlertTitle>
                    <AlertDescription>
                      No meals found for this meal plan. Please select a different plan or contact support.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Accordion type="single" collapsible className="w-full" defaultValue={startDate?.toISOString()}>
                    {sortedSelectedDays.map((day) => (
                      <AccordionItem key={day.toISOString()} value={day.toISOString()}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{format(day, "EEEE, MMM d")}</span>
                            {Object.keys(menuSelections[day.toISOString()] || {}).every(
                              (mealType) => menuSelections[day.toISOString()]?.[mealType],
                            ) ? (
                              <span className="text-sm text-green-600 mr-2 flex items-center">
                                <Check className="h-4 w-4 mr-1" /> Complete
                              </span>
                            ) : (
                              <span className="text-sm text-amber-600 mr-2">Incomplete</span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6 pt-2">
                            {/* Render meal selectors for each meal type */}
                            {selectedMealTypes.map((mealType) => {
                              const availableMeals = mealsByType[mealType] || []
                              return (
                                <div key={`${day.toISOString()}-${mealType}`} className="border rounded-lg p-4">
                                  <h4 className="font-medium text-base mb-4 capitalize">{mealType}</h4>
                                  {menuSelections[day.toISOString()]?.[mealType] ? (
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                      <div className="flex items-center">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-md mr-3">
                                          <Image
                                            src={
                                              menuSelections[day.toISOString()][mealType].image ||
                                              "/placeholder.svg?height=64&width=64&query=meal"
                                            }
                                            alt={menuSelections[day.toISOString()][mealType].name}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div>
                                          <h5 className="font-medium">
                                            {menuSelections[day.toISOString()][mealType].name}
                                          </h5>
                                          <p className="text-sm text-gray-500">
                                            {menuSelections[day.toISOString()][mealType].calories || 0} calories
                                          </p>
                                        </div>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMealSelection(day, mealType, null)}
                                      >
                                        Change
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                      {availableMeals.length > 0 ? (
                                        availableMeals.map((meal) => (
                                          <div
                                            key={meal.id}
                                            className="border rounded-md overflow-hidden cursor-pointer hover:border-fitnest-green transition-colors"
                                            onClick={() => handleMealSelection(day, mealType, meal)}
                                          >
                                            <div className="relative h-32 w-full bg-gray-100">
                                              {meal.image ? (
                                                <Image
                                                  src={meal.image}
                                                  alt={meal.name}
                                                  fill
                                                  className="object-cover"
                                                />
                                              ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                  No Image
                                                </div>
                                              )}
                                            </div>
                                            <div className="p-2">
                                              <h5 className="font-medium text-sm">{meal.name}</h5>
                                              <p className="text-xs text-gray-500">
                                                {meal.calories || 0} calories
                                              </p>
                                              {meal.description && (
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                  {meal.description}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="col-span-full p-6 text-center border rounded-lg bg-yellow-50">
                                          <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                                          <p className="text-sm font-medium text-gray-900">
                                            No {mealType} meals available
                                          </p>
                                          <p className="text-xs text-gray-600 mt-1">
                                            Please contact support or select a different meal plan
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                            {/* Render snack selectors */}
                            {Array.from({
                              length: selectedSnacks === "1-snack" ? 1 : selectedSnacks === "2-snacks" ? 2 : 0,
                            }).map((_, i) => {
                              const snackKey = `snack${i + 1}`
                              const availableSnacks = mealsByType["snack"] || []
                              return (
                                <div key={`${day.toISOString()}-${snackKey}`} className="border rounded-lg p-4">
                                  <h4 className="font-medium text-base mb-4 capitalize">
                                    {i > 0 ? "Second Snack" : "Snack"}
                                  </h4>
                                  {menuSelections[day.toISOString()]?.[snackKey] ? (
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                      <div className="flex items-center">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-md mr-3">
                                          <Image
                                            src={
                                              menuSelections[day.toISOString()][snackKey].image ||
                                              "/placeholder.svg?height=64&width=64&query=snack"
                                            }
                                            alt={menuSelections[day.toISOString()][snackKey].name}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div>
                                          <h5 className="font-medium">
                                            {menuSelections[day.toISOString()][snackKey].name}
                                          </h5>
                                          <p className="text-sm text-gray-500">
                                            {menuSelections[day.toISOString()][snackKey].calories || 0} calories
                                          </p>
                                        </div>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMealSelection(day, snackKey, null)}
                                      >
                                        Change
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                      {availableSnacks.length > 0 ? (
                                        availableSnacks.map((meal) => (
                                          <div
                                            key={meal.id}
                                            className="border rounded-md overflow-hidden cursor-pointer hover:border-fitnest-green transition-colors"
                                            onClick={() => handleMealSelection(day, snackKey, meal)}
                                          >
                                            <div className="relative h-32 w-full bg-gray-100">
                                              {meal.image ? (
                                                <Image
                                                  src={meal.image}
                                                  alt={meal.name}
                                                  fill
                                                  className="object-cover"
                                                />
                                              ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                  No Image
                                                </div>
                                              )}
                                            </div>
                                            <div className="p-2">
                                              <h5 className="font-medium text-sm">{meal.name}</h5>
                                              <p className="text-xs text-gray-500">{meal.calories || 0} calories</p>
                                              {meal.description && (
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                  {meal.description}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="col-span-full p-6 text-center border rounded-lg bg-yellow-50">
                                          <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                                          <p className="text-sm font-medium text-gray-900">
                                            No snack meals available
                                          </p>
                                          <p className="text-xs text-gray-600 mt-1">
                                            Please contact support or select a different meal plan
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-fitnest-orange hover:bg-fitnest-orange/90"
                  disabled={!isMenuComplete()}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Please provide your contact details to complete your order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="client_name" className="text-base font-medium mb-2 block">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="client_name"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter your full name"
                    className={cn(errors.clientName && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
                </div>

                <div>
                  <Label htmlFor="client_email" className="text-base font-medium mb-2 block">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className={cn(errors.clientEmail && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {errors.clientEmail && <p className="text-red-500 text-sm mt-1">{errors.clientEmail}</p>}
                </div>

                <div>
                  <Label htmlFor="client_phone" className="text-base font-medium mb-2 block">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="client_phone"
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className={cn(errors.clientPhone && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {errors.clientPhone && <p className="text-red-500 text-sm mt-1">{errors.clientPhone}</p>}
                </div>

                <div className="rounded-lg border bg-gray-50 p-4 space-y-2">
                  <h4 className="font-semibold text-gray-900">Order Summary</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Meal Plan:</span>
                      <span className="font-medium">{selectedPlan?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Days:</span>
                      <span className="font-medium">{selectedDays.length} days</span>
                    </div>
                    {priceBreakdown && (
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-gray-900 font-semibold">Total:</span>
                        <span className="text-gray-900 font-semibold">{formatPrice(priceBreakdown.finalTotal)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-fitnest-orange hover:bg-fitnest-orange/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Complete Order"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlan && (
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={selectedPlan.image || '/placeholder.svg'}
                        alt={selectedPlan.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedPlan.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedMealTypes.length} meals,{" "}
                        {selectedSnacks !== "0-snacks"
                          ? selectedSnacks === "1-snack"
                            ? "1 snack"
                            : "2 snacks"
                          : "no snacks"}
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Meal Plan:</span>
                    <span>{selectedPlan?.name || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Meals Per Day:</span>
                    <span>{selectedMealTypes.length} meals</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Snacks Per Day:</span>
                    <span>
                      {selectedSnacks === "0-snacks"
                        ? "No snacks"
                        : selectedSnacks === "1-snack"
                          ? "1 snack"
                          : "2 snacks"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Delivery Days:</span>
                    <span>{selectedDays.length} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span>{durationOptions.find((opt) => opt.value === duration)?.label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Start Date:</span>
                    <span>{startDate ? format(startDate, "MMM d, yyyy") : "Not selected"}</span>
                  </div>
                </div>

                <Separator />

                {priceBreakdown && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cost Per Day:</span>
                      <span>{formatPrice(priceBreakdown.pricePerDay)}</span>
                    </div>

                    {duration === 1 && (
                      <div className="flex justify-between text-sm">
                        <span>Weekly Cost:</span>
                        <span>{formatPrice(priceBreakdown.pricePerWeek)}</span>
                      </div>
                    )}

                    {priceBreakdown.discounts.totalDiscount > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>
                            {formatPrice(
                              priceBreakdown.subscriptionTotals.subscriptionSubtotal +
                                priceBreakdown.discounts.totalDiscount,
                            )}
                          </span>
                        </div>

                        {priceBreakdown.discounts.appliedWeeklyDiscount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Volume Discount ({priceBreakdown.discounts.appliedWeeklyDiscount}%):</span>
                            <span>
                              -
                              {formatPrice(
                                priceBreakdown.discounts.totalDiscount -
                                  priceBreakdown.discounts.durationDiscount -
                                  priceBreakdown.discounts.seasonalDiscount,
                              )}
                            </span>
                          </div>
                        )}

                        {priceBreakdown.discounts.durationDiscount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Duration Discount:</span>
                            <span>-{formatPrice(priceBreakdown.discounts.durationDiscount)}</span>
                          </div>
                        )}

                        {priceBreakdown.discounts.seasonalDiscount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Promo Discount:</span>
                            <span>-{formatPrice(priceBreakdown.discounts.seasonalDiscount)}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-sm font-medium text-green-600">
                          <span>Total Savings:</span>
                          <span>-{formatPrice(priceBreakdown.discounts.totalDiscount)}</span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Final Total:</span>
                      <span>{formatPrice(priceBreakdown.finalTotal)}</span>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Total Items: {priceBreakdown.totalItems}</div>
                      <div>
                        Duration: {priceBreakdown.totalWeeks} week{priceBreakdown.totalWeeks > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                )}

                {pricingError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{pricingError}</AlertDescription>
                  </Alert>
                )}

                <div className="rounded-md bg-gray-50 p-3">
                  <div className="flex">
                    <Info className="h-5 w-5 text-fitnest-orange mr-2" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Flexible Subscription</p>
                      <p>You can pause, modify, or cancel your subscription anytime.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {step === 2 ? (
                  <Button
                    onClick={handleNext}
                    className="w-full bg-fitnest-orange hover:bg-fitnest-orange/90"
                    disabled={!isMenuComplete()}
                  >
                    Continue
                  </Button>
                ) : step === 3 ? (
                  <Button
                    onClick={handleNext}
                    className="w-full bg-fitnest-orange hover:bg-fitnest-orange/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Complete Order"}
                  </Button>
                ) : (
                  <Button className="w-full" onClick={handleNext} disabled={!meetsMinimumRequirements()}>
                    Continue to Menu Building
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
