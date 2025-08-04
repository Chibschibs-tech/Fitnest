"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import {
  format,
  addHours,
  isBefore,
  isFriday,
  getDay,
  nextMonday,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isWithinInterval,
  isSameDay,
} from "date-fns"
import { CalendarIcon, ChevronLeft, Info, Check, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

// Data (should be fetched from an API in a real app)
const mealPlans = {
  "weight-loss": { title: "Weight Loss", basePrice: 350, image: "/vibrant-weight-loss-meal.png" },
  "stay-fit": { title: "Stay Fit", basePrice: 320, image: "/vibrant-nutrition-plate.png" },
  "muscle-gain": { title: "Muscle Gain", basePrice: 400, image: "/hearty-muscle-meal.png" },
  keto: { title: "Keto", basePrice: 380, image: "/colorful-keto-plate.png" },
}
const mealTypes = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
]
const snackOptions = [
  { id: "0-snacks", label: "No Snacks", multiplier: 0 },
  { id: "1-snack", label: "1 Snack / Day", multiplier: 0.2 },
  { id: "2-snacks", label: "2 Snacks / Day", multiplier: 0.35 },
]
const durationOptions = [
  { id: "1-week", label: "1 Week", weeks: 1 },
  { id: "2-weeks", label: "2 Weeks", weeks: 2 },
  { id: "1-month", label: "1 Month", weeks: 4 },
]
const sampleMeals = {
  breakfast: [{ id: "b1", name: "Protein Stack" }, { id: "b2", name: "Berry Parfait" }],
  lunch: [{ id: "l1", name: "Chicken Medley" }, { id: "l2", name: "Rainbow Bowl" }],
  dinner: [{ id: "d1", name: "Salmon Quinoa" }, { id: "d2", name: "Turkey Meatballs" }],
  snack: [{ id: "s1", name: "Yogurt" }, { id: "s2", name: "Energy Bites" }],
}

// Helper to determine the start of the selection period
const getCalendarStartInfo = () => {
  const now = new Date()
  const firstSelectableDate = addHours(now, 48)
  let calendarViewStart = startOfWeek(now, { weekStartsOn: 1 })

  const dayOfWeek = getDay(now) // Sunday is 0
  if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
    calendarViewStart = nextMonday(now)
  }
  
  return { calendarViewStart, firstSelectableDate }
}

export function OrderProcess() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [step, setStep] = useState(1)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>(["lunch", "dinner"])
  const [selectedSnacks, setSelectedSnacks] = useState("0-snacks")
  const [duration, setDuration] = useState("1-week")
  const [selectedDays, setSelectedDays] = useState<Date[]>([])
  const [menuSelections, setMenuSelections] = useState<Record<string, Record<string, string[]>>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [displayMonth, setDisplayMonth] = useState<Date>()

  // FIX: Initialize selectedPlanId from URL search params
  useEffect(() => {
    const planIdFromUrl = searchParams.get("plan")
    if (planIdFromUrl && mealPlans[planIdFromUrl as keyof typeof mealPlans]) {
      setSelectedPlanId(planIdFromUrl)
    }
  }, [searchParams])

  // Memoized values for performance
  const { calendarViewStart, firstSelectableDate } = useMemo(getCalendarStartInfo, [])
  const selectedPlan = selectedPlanId ? mealPlans[selectedPlanId as keyof typeof mealPlans] : null
  const weeksInDuration = useMemo(() => durationOptions.find(d => d.id === duration)?.weeks || 1, [duration])
  const calendarEndDate = useMemo(() => endOfWeek(addWeeks(calendarViewStart, weeksInDuration - 1)), [calendarViewStart, weeksInDuration])

  useEffect(() => {
    setDisplayMonth(calendarViewStart)
  }, [calendarViewStart])

  // Reset selected days if duration changes
  useEffect(() => {
    setSelectedDays([])
  }, [duration])

  // Price Calculation
  const totalPrice = useMemo(() => {
    if (!selectedPlan) return 0
    const basePrice = selectedPlan.basePrice / 7
    let mealTypeMultiplier = 0
    if (selectedMealTypes.includes("breakfast")) mealTypeMultiplier += 0.3
    if (selectedMealTypes.includes("lunch")) mealTypeMultiplier += 0.35
    if (selectedMealTypes.includes("dinner")) mealTypeMultiplier += 0.35
    const snackMultiplier = snackOptions.find((option) => option.id === selectedSnacks)?.multiplier || 0
    const dailyPrice = basePrice * (mealTypeMultiplier + snackMultiplier)
    return Math.round(dailyPrice * selectedDays.length)
  }, [selectedPlan, selectedMealTypes, selectedSnacks, selectedDays])

  // Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedPlanId) newErrors.mealPlan = "Please select a meal plan."
    if (selectedMealTypes.length < 2) newErrors.mealTypes = "Please select at least 2 meal types."
    
    for (let i = 0; i < weeksInDuration; i++) {
      const weekStart = addWeeks(startOfWeek(calendarViewStart, { weekStartsOn: 1 }), i)
      const selectedInWeek = selectedDays.filter((day) => isWithinInterval(day, { start: weekStart, end: endOfWeek(weekStart) }))
      if (selectedInWeek.length < 2) {
        newErrors.days = `Please select at least 2 days for the week of ${format(weekStart, "MMM d")}.`
        break
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isMenuComplete = useMemo(() => {
    if (selectedDays.length === 0) return false
    const snackCount = selectedSnacks === "1-snack" ? 1 : selectedSnacks === "2-snacks" ? 2 : 0
    return selectedDays.every(day => {
      const dayISO = day.toISOString().split('T')[0]
      const dayMenu = menuSelections[dayISO]
      return dayMenu && dayMenu.meals?.length === selectedMealTypes.length && dayMenu.snacks?.length === snackCount
    })
  }, [menuSelections, selectedDays, selectedMealTypes, selectedSnacks])

  // Handlers
  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        const initialMenu: typeof menuSelections = {}
        selectedDays.forEach(day => {
          initialMenu[day.toISOString().split('T')[0]] = { meals: [], snacks: [] }
        })
        setMenuSelections(initialMenu)
        setStep(2)
        window.scrollTo(0, 0)
      }
    } else {
      if (!isMenuComplete) {
        setErrors({ menu: "Please complete your menu selections for all days." })
        return
      }
      // Proceed to checkout logic
      router.push("/checkout")
    }
  }

  if (!selectedPlanId) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold">Invalid Meal Plan</h2>
        <p className="text-gray-600 mt-2">The meal plan you selected does not exist. Please go back and select a valid plan.</p>
        <Link href="/meal-plans" className="mt-4 inline-block">
          <Button>View Meal Plans</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Plan Customization */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Customize Your Plan</CardTitle>
                <CardDescription>Select your preferences to create the perfect meal plan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Duration and Day Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">1. Select duration and delivery days</Label>
                  <RadioGroup value={duration} onValueChange={setDuration} className="grid grid-cols-3 gap-4 mb-4">
                    {durationOptions.map((option) => (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={`duration-${option.id}`} className="peer sr-only" />
                        <Label htmlFor={`duration-${option.id}`} className="flex items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-fitnest-green [&:has([data-state=checked])]:border-fitnest-green">
                          <span className="font-semibold">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-gray-600 mb-4">Select at least 2 delivery days for each week.</p>
                    <Calendar
                      mode="multiple"
                      selected={selectedDays}
                      onSelect={(days) => setSelectedDays(days || [])}
                      month={displayMonth}
                      onMonthChange={setDisplayMonth}
                      numberOfMonths={duration === "1-month" ? 2 : 1}
                      disabled={(date) => isBefore(date, firstSelectableDate) || !isWithinInterval(date, { start: calendarViewStart, end: calendarEndDate })}
                      className="p-0"
                    />
                  </div>
                  {errors.days && <p className="text-red-500 text-sm mt-2">{errors.days}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleNext} className="w-full">Continue to Menu Building</Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Menu Building */}
          {step === 2 && (
             <Card>
              <CardHeader>
                <CardTitle>Step 2: Build Your Menu</CardTitle>
                <CardDescription>Select your meals for each delivery day.</CardDescription>
              </CardHeader>
              <CardContent>
                {errors.menu && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertTitle>Incomplete Menu</AlertTitle><AlertDescription>{errors.menu}</AlertDescription></Alert>}
                <Accordion type="multiple" className="w-full">
                  {selectedDays.map(day => {
                    const dayISO = day.toISOString().split('T')[0]
                    return (
                      <AccordionItem value={dayISO} key={dayISO}>
                        <AccordionTrigger>{format(day, "EEEE, MMM d")}</AccordionTrigger>
                        <AccordionContent>
                          {/* Meal selection logic here */}
                          <p>Meal selection for {format(day, "PPP")}</p>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleNext} disabled={!isMenuComplete}>Proceed to Checkout</Button>
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
                    <Image src={selectedPlan.image || "/placeholder.svg"} alt={selectedPlan.title} width={64} height={64} className="rounded-md object-cover" />
                    <div>
                      <h3 className="font-semibold">{selectedPlan.title}</h3>
                      <p className="text-sm text-gray-500">{selectedMealTypes.length} meals, {selectedSnacks.replace("-", " ")}</p>
                    </div>
                  </div>
                )}
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Duration:</span><span>{durationOptions.find(d => d.id === duration)?.label}</span></div>
                  <div className="flex justify-between"><span>Delivery Days:</span><span>{selectedDays.length} days</span></div>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Price:</span>
                  <span>{totalPrice} MAD</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
