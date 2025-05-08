"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { format, addDays, getDay, isBefore, addHours } from "date-fns"
import { CalendarIcon, ChevronLeft, Info, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

// Define meal plan data - UPDATED with Stay Fit instead of Balanced Nutrition
const mealPlans = {
  "weight-loss": {
    title: "Weight Loss",
    description:
      "Calorie-controlled meals (1200-1500 calories per day) designed to help you lose weight while staying satisfied.",
    basePrice: 350,
    image: "/vibrant-weight-loss-meal.png",
  },
  "stay-fit": {
    title: "Stay Fit",
    description:
      "Well-rounded meals (1600-1900 calories per day) with optimal proportions of proteins, carbs, and healthy fats.",
    basePrice: 320,
    image: "/vibrant-nutrition-plate.png",
  },
  "muscle-gain": {
    title: "Muscle Gain",
    description:
      "Protein-rich meals (2200-2500 calories per day) to support muscle growth and recovery after workouts.",
    basePrice: 400,
    image: "/hearty-muscle-meal.png",
  },
  keto: {
    title: "Keto",
    description:
      "Low-carb, high-fat meals (1700-1900 calories per day) designed to help you achieve and maintain ketosis.",
    basePrice: 380,
    image: "/colorful-keto-plate.png",
  },
}

const mealTypes = [
  { id: "breakfast", label: "Breakfast", description: "Start your day right" },
  { id: "lunch", label: "Lunch", description: "Midday energy boost" },
  { id: "dinner", label: "Dinner", description: "Evening nourishment" },
]

const snackOptions = [
  { id: "0-snacks", label: "No Snacks", description: "No additional snacks", multiplier: 0 },
  { id: "1-snack", label: "1 Snack / Day", description: "One healthy snack per day", multiplier: 0.2 },
  { id: "2-snacks", label: "2 Snacks / Day", description: "Two healthy snacks per day", multiplier: 0.35 },
]

// Add allergies data after the snackOptions array
const allergies = [
  { id: "dairy", label: "Dairy", description: "Milk, cheese, yogurt" },
  { id: "gluten", label: "Gluten", description: "Wheat, barley, rye" },
  { id: "nuts", label: "Nuts", description: "Peanuts, tree nuts" },
  { id: "shellfish", label: "Shellfish", description: "Shrimp, crab, lobster" },
  { id: "eggs", label: "Eggs", description: "Chicken eggs" },
  { id: "soy", label: "Soy", description: "Soybeans and products" },
]

// UPDATED: Reordered weekdays to start with Monday
const weekdays = [
  { id: "monday", label: "M", fullLabel: "Monday" },
  { id: "tuesday", label: "T", fullLabel: "Tuesday" },
  { id: "wednesday", label: "W", fullLabel: "Wednesday" },
  { id: "thursday", label: "T", fullLabel: "Thursday" },
  { id: "friday", label: "F", fullLabel: "Friday" },
  { id: "saturday", label: "S", fullLabel: "Saturday" },
  { id: "sunday", label: "S", fullLabel: "Sunday" },
]

const paymentCycles = [
  { id: "weekly", label: "Weekly", description: "Pay every week", multiplier: 1 },
  { id: "monthly", label: "Monthly", description: "Pay every month", multiplier: 0.95, popular: true },
  { id: "3-months", label: "3 Months", description: "Pay every 3 months", multiplier: 0.9 },
]

// Sample meals for menu building
const sampleMeals = {
  breakfast: [
    { id: "b1", name: "Fluffy Protein Stack", image: "/fluffy-protein-stack.png", calories: 320 },
    { id: "b2", name: "Layered Berry Parfait", image: "/layered-berry-parfait.png", calories: 280 },
    { id: "b3", name: "Fluffy Egg White Omelette", image: "/fluffy-egg-white-omelette.png", calories: 250 },
    { id: "b4", name: "Colorful Overnight Oats", image: "/colorful-overnight-oats.png", calories: 310 },
  ],
  lunch: [
    {
      id: "l1",
      name: "Grilled Chicken Vegetable Medley",
      image: "/grilled-chicken-vegetable-medley.png",
      calories: 420,
    },
    { id: "l2", name: "Rainbow Grain Bowl", image: "/rainbow-grain-bowl.png", calories: 380 },
    { id: "l3", name: "Fresh Tuna Avocado Wrap", image: "/fresh-tuna-avocado-wrap.png", calories: 450 },
    { id: "l4", name: "Chicken Quinoa Power Bowl", image: "/chicken-quinoa-power-bowl.png", calories: 410 },
  ],
  dinner: [
    { id: "d1", name: "Pan Seared Salmon Quinoa", image: "/pan-seared-salmon-quinoa.png", calories: 480 },
    { id: "d2", name: "Savory Turkey Meatballs", image: "/savory-turkey-meatballs.png", calories: 420 },
    { id: "d3", name: "Vibrant Vegetable Stir Fry", image: "/vibrant-vegetable-stir-fry.png", calories: 350 },
    { id: "d4", name: "Classic Beef Broccoli", image: "/classic-beef-broccoli.png", calories: 460 },
  ],
  snack: [
    { id: "s1", name: "Greek Yogurt with Berries", image: "/placeholder.svg?key=tsc4q", calories: 150 },
    { id: "s2", name: "Protein Energy Bites", image: "/placeholder.svg?key=l7j8m", calories: 120 },
    { id: "s3", name: "Mixed Nuts and Dried Fruits", image: "/placeholder.svg?key=z4g0i", calories: 180 },
    { id: "s4", name: "Vegetable Sticks with Hummus", image: "/placeholder.svg?key=5dbft", calories: 130 },
  ],
}

export function OrderProcess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planIdFromUrl = searchParams.get("plan")

  // Map old plan ID to new plan ID if needed
  const mappedPlanId = planIdFromUrl === "balanced-nutrition" ? "stay-fit" : planIdFromUrl

  // Selected meal plan
  const [selectedPlanId, setSelectedPlanId] = useState<string>(mappedPlanId || "")
  const selectedPlan = selectedPlanId ? mealPlans[selectedPlanId as keyof typeof mealPlans] : null

  // Selected meal types
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>(["lunch", "dinner"])

  // Selected snack option
  const [selectedSnacks, setSelectedSnacks] = useState("0-snacks")

  // Add selectedAllergies state after the selectedSnacks state
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])

  // UPDATED: Pre-select the first 3 days of the week (Monday, Tuesday, Wednesday)
  const [selectedDays, setSelectedDays] = useState<string[]>(["monday", "tuesday", "wednesday"])

  // Payment cycle
  const [paymentCycle, setPaymentCycle] = useState("monthly")

  // Calculate the minimum valid start date (48 hours from now)
  const minStartDate = addHours(new Date(), 48)

  // Helper function to find the next occurrence of a day
  const getNextDayOccurrence = (dayId: string) => {
    const today = new Date()
    const dayIndex = weekdays.findIndex((day) => day.id === dayId)
    const todayIndex = getDay(today) === 0 ? 6 : getDay(today) - 1 // Convert to 0 = Monday, 6 = Sunday

    let daysToAdd = dayIndex - todayIndex
    if (daysToAdd <= 0) daysToAdd += 7 // If the day has already passed this week, go to next week

    return addDays(today, daysToAdd)
  }

  // Calculate the appropriate start date based on selected days
  const calculateStartDate = () => {
    if (selectedDays.length === 0) return addDays(minStartDate, 1)

    // Sort days by their order in the week
    const sortedDays = [...selectedDays].sort((a, b) => {
      const aIndex = weekdays.findIndex((day) => day.id === a)
      const bIndex = weekdays.findIndex((day) => day.id === b)
      return aIndex - bIndex
    })

    // Get the next occurrence of the first selected day
    const firstDayDate = getNextDayOccurrence(sortedDays[0])

    // If it's less than 48 hours away, go to the next week
    if (isBefore(firstDayDate, minStartDate)) {
      return addDays(firstDayDate, 7)
    }

    return firstDayDate
  }

  // Start date - UPDATED to use the calculated start date
  const [startDate, setStartDate] = useState<Date | undefined>(calculateStartDate())

  // Update start date when selected days change
  useEffect(() => {
    setStartDate(calculateStartDate())
  }, [selectedDays])

  // Current step
  const [step, setStep] = useState(1)

  // Menu selections
  const [menuSelections, setMenuSelections] = useState<Record<string, Record<string, any>>>({})

  // Validation errors
  const [errors, setErrors] = useState<{
    mealPlan?: string
    mealTypes?: string
    days?: string
    menu?: string
  }>({})

  // Calculate base price per day
  const calculateDailyPrice = () => {
    if (!selectedPlan) return 0

    const basePrice = selectedPlan.basePrice / 7 // Convert weekly price to daily

    // Calculate price based on selected meal types
    let mealTypeMultiplier = 0
    if (selectedMealTypes.includes("breakfast")) mealTypeMultiplier += 0.3
    if (selectedMealTypes.includes("lunch")) mealTypeMultiplier += 0.35
    if (selectedMealTypes.includes("dinner")) mealTypeMultiplier += 0.35

    // Add snack multiplier
    const snackMultiplier = snackOptions.find((option) => option.id === selectedSnacks)?.multiplier || 0

    return Math.round(basePrice * (mealTypeMultiplier + snackMultiplier) * 10) / 10
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    const dailyPrice = calculateDailyPrice()
    const daysPerWeek = selectedDays.length
    const cycleMultiplier = paymentCycles.find((cycle) => cycle.id === paymentCycle)?.multiplier || 1

    // Calculate based on payment cycle
    let totalPrice = 0
    if (paymentCycle === "weekly") {
      totalPrice = dailyPrice * daysPerWeek
    } else if (paymentCycle === "monthly") {
      totalPrice = dailyPrice * daysPerWeek * 4
    } else if (paymentCycle === "3-months") {
      totalPrice = dailyPrice * daysPerWeek * 12
    }

    // Apply cycle discount
    totalPrice = totalPrice * cycleMultiplier

    return Math.round(totalPrice)
  }

  // Initialize menu selections when days change
  useEffect(() => {
    const newMenuSelections: Record<string, Record<string, any>> = {}

    selectedDays.forEach((day) => {
      newMenuSelections[day] = {}

      // Add meal types
      selectedMealTypes.forEach((mealType) => {
        newMenuSelections[day][mealType] = null
      })

      // Add snacks based on selection
      if (selectedSnacks === "1-snack") {
        newMenuSelections[day]["snack1"] = null
      } else if (selectedSnacks === "2-snacks") {
        newMenuSelections[day]["snack1"] = null
        newMenuSelections[day]["snack2"] = null
      }
    })

    setMenuSelections(newMenuSelections)
  }, [selectedDays, selectedMealTypes, selectedSnacks])

  // Handle meal type selection
  const handleMealTypeToggle = (mealTypeId: string) => {
    setSelectedMealTypes((prev) => {
      // If trying to deselect and we would have less than 2 meal types, prevent it
      if (prev.includes(mealTypeId) && prev.length <= 2) {
        return prev
      }

      // Toggle the selection
      return prev.includes(mealTypeId) ? prev.filter((id) => id !== mealTypeId) : [...prev, mealTypeId]
    })
  }

  // Handle day selection - UPDATED to require minimum 3 days
  const handleDayToggle = (dayId: string) => {
    setSelectedDays((prev) => {
      // If trying to deselect and we would have less than 3 days, prevent it
      if (prev.includes(dayId) && prev.length <= 3) {
        return prev
      }

      // Toggle the selection
      return prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
    })
  }

  // Add handleAllergyToggle function after the handleDayToggle function
  const handleAllergyToggle = (allergyId: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergyId) ? prev.filter((id) => id !== allergyId) : [...prev, allergyId],
    )
  }

  // Handle meal selection for menu building
  const handleMealSelection = (day: string, mealType: string, meal: any) => {
    setMenuSelections((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: meal,
      },
    }))
  }

  // Check if all meals are selected
  const isMenuComplete = () => {
    for (const day of selectedDays) {
      // Check meal types
      for (const mealType of selectedMealTypes) {
        if (!menuSelections[day]?.[mealType]) {
          return false
        }
      }

      // Check snacks
      if (selectedSnacks === "1-snack" && !menuSelections[day]?.["snack1"]) {
        return false
      }
      if (selectedSnacks === "2-snacks" && (!menuSelections[day]?.["snack1"] || !menuSelections[day]?.["snack2"])) {
        return false
      }
    }
    return true
  }

  // Validate current step - UPDATED to require minimum 3 days
  const validateStep = () => {
    const newErrors: {
      mealPlan?: string
      mealTypes?: string
      days?: string
      menu?: string
    } = {}

    if (step === 1) {
      if (!selectedPlanId) {
        newErrors.mealPlan = "Please select a meal plan"
      }
      if (selectedMealTypes.length < 2) {
        newErrors.mealTypes = "Please select at least 2 meal types"
      }
      if (selectedDays.length < 3) {
        newErrors.days = "Please select at least 3 days"
      }
    } else if (step === 2) {
      if (!isMenuComplete()) {
        newErrors.menu = "Please select all meals for your plan"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      if (step < 2) {
        setStep(step + 1)
        window.scrollTo(0, 0)
      } else {
        // Submit order
        router.push("/checkout")
      }
    }
  }

  // Handle back step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    } else {
      router.push(selectedPlanId ? `/meal-plans/${selectedPlanId}` : "/meal-plans")
    }
  }

  // Get day name from day id
  const getDayName = (dayId: string) => {
    return weekdays.find((day) => day.id === dayId)?.fullLabel || dayId
  }

  // Format day for display
  const formatDay = (dayId: string) => {
    const dayIndex = weekdays.findIndex((day) => day.id === dayId)
    if (dayIndex === -1) return dayId

    // If we have a start date, calculate the actual date for this day
    if (startDate) {
      const startDayIndex = getDay(startDate)
      const daysToAdd = (dayIndex - startDayIndex + 7) % 7
      const dayDate = addDays(startDate, daysToAdd)
      return `${getDayName(dayId)} (${format(dayDate, "MMM d")})`
    }

    return getDayName(dayId)
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
                  <RadioGroup
                    value={selectedPlanId}
                    onValueChange={setSelectedPlanId}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {Object.entries(mealPlans).map(([id, plan]) => (
                      <div key={id}>
                        <RadioGroupItem value={id} id={`plan-${id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`plan-${id}`}
                          className="flex items-center space-x-4 rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-fitnest-green [&:has([data-state=checked])]:border-fitnest-green"
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-md">
                            <Image
                              src={plan.image || "/placeholder.svg"}
                              alt={plan.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{plan.title}</h3>
                            <p className="text-sm text-gray-500">{plan.description}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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
                          onChange={() => handleMealTypeToggle(mealType.id)}
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
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-fitnest-green [&:has([data-state=checked])]:border-fitnest-green"
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

                {/* Days Selection - UPDATED to require minimum 3 days */}
                <div>
                  <Label className="text-base font-medium mb-3 block">How many days a week?</Label>
                  <p className="text-sm text-gray-500 mb-4">Select a minimum of 3 days.</p>

                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {weekdays.map((day) => (
                      <div key={day.id} className="relative">
                        <input
                          type="checkbox"
                          id={`day-${day.id}`}
                          checked={selectedDays.includes(day.id)}
                          onChange={() => handleDayToggle(day.id)}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={`day-${day.id}`}
                          className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-full border-2 border-muted bg-white hover:bg-gray-50 hover:border-gray-200 cursor-pointer",
                            selectedDays.includes(day.id) ? "border-fitnest-green bg-fitnest-green text-white" : "",
                          )}
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  {errors.days && <p className="text-red-500 text-sm mt-2">{errors.days}</p>}
                </div>

                {/* Payment Cycle */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Payment Cycle</Label>
                  <RadioGroup
                    value={paymentCycle}
                    onValueChange={setPaymentCycle}
                    className="grid gap-4 md:grid-cols-3"
                  >
                    {paymentCycles.map((cycle) => (
                      <div key={cycle.id}>
                        <RadioGroupItem value={cycle.id} id={`cycle-${cycle.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`cycle-${cycle.id}`}
                          className="relative flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-fitnest-green [&:has([data-state=checked])]:border-fitnest-green"
                        >
                          {cycle.popular && (
                            <div className="absolute -top-2 -right-2 bg-fitnest-orange text-white text-xs px-2 py-1 rounded-full">
                              Popular
                            </div>
                          )}
                          <div className="text-center">
                            <h3 className="font-semibold">{cycle.label}</h3>
                            <p className="text-sm text-gray-500">{cycle.description}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Start Date - UPDATED with better explanation */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Start Date</Label>
                  <div className="flex flex-col space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full md:w-[280px] justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          disabled={(date) => isBefore(date, minStartDate)}
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>We need at least 48 hours to prepare your first delivery.</p>
                      <p>Your start date will be the next occurrence of your first selected day of the week.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!startDate || !selectedPlanId}>
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

                <Accordion type="single" collapsible className="w-full">
                  {selectedDays.map((day, index) => (
                    <AccordionItem key={day} value={day}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <span className="font-medium">{formatDay(day)}</span>
                          </div>
                          <div className="flex items-center">
                            {Object.keys(menuSelections[day] || {}).every(
                              (mealType) => menuSelections[day]?.[mealType],
                            ) ? (
                              <span className="text-sm text-green-600 mr-2 flex items-center">
                                <Check className="h-4 w-4 mr-1" /> Complete
                              </span>
                            ) : (
                              <span className="text-sm text-amber-600 mr-2">Incomplete</span>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6 pt-2">
                          {/* Meal Types */}
                          {selectedMealTypes.map((mealType) => (
                            <div key={`${day}-${mealType}`} className="border rounded-lg p-4">
                              <h4 className="font-medium text-base mb-4 capitalize">
                                {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                              </h4>

                              {menuSelections[day]?.[mealType] ? (
                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                  <div className="flex items-center">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md mr-3">
                                      <Image
                                        src={menuSelections[day][mealType].image || "/placeholder.svg"}
                                        alt={menuSelections[day][mealType].name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <h5 className="font-medium">{menuSelections[day][mealType].name}</h5>
                                      <p className="text-sm text-gray-500">
                                        {menuSelections[day][mealType].calories} calories
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
                                  {sampleMeals[mealType as keyof typeof sampleMeals].map((option) => (
                                    <div
                                      key={option.id}
                                      className="border rounded-md overflow-hidden cursor-pointer hover:border-fitnest-green transition-colors"
                                      onClick={() => handleMealSelection(day, mealType, option)}
                                    >
                                      <div className="relative h-32 w-full">
                                        <Image
                                          src={option.image || "/placeholder.svg"}
                                          alt={option.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div className="p-2">
                                        <h5 className="font-medium text-sm">{option.name}</h5>
                                        <p className="text-xs text-gray-500">{option.calories} calories</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Snacks */}
                          {selectedSnacks === "1-snack" && (
                            <div key={`${day}-snack1`} className="border rounded-lg p-4">
                              <h4 className="font-medium text-base mb-4">Snack</h4>

                              {menuSelections[day]?.["snack1"] ? (
                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                  <div className="flex items-center">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md mr-3">
                                      <Image
                                        src={menuSelections[day]["snack1"].image || "/placeholder.svg"}
                                        alt={menuSelections[day]["snack1"].name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <h5 className="font-medium">{menuSelections[day]["snack1"].name}</h5>
                                      <p className="text-sm text-gray-500">
                                        {menuSelections[day]["snack1"].calories} calories
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMealSelection(day, "snack1", null)}
                                  >
                                    Change
                                  </Button>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                  {sampleMeals["snack"].map((option) => (
                                    <div
                                      key={option.id}
                                      className="border rounded-md overflow-hidden cursor-pointer hover:border-fitnest-green transition-colors"
                                      onClick={() => handleMealSelection(day, "snack1", option)}
                                    >
                                      <div className="relative h-32 w-full">
                                        <Image
                                          src={option.image || "/placeholder.svg"}
                                          alt={option.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div className="p-2">
                                        <h5 className="font-medium text-sm">{option.name}</h5>
                                        <p className="text-xs text-gray-500">{option.calories} calories</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {selectedSnacks === "2-snacks" && (
                            <>
                              <div key={`${day}-snack1`} className="border rounded-lg p-4">
                                <h4 className="font-medium text-base mb-4">First Snack</h4>

                                {menuSelections[day]?.["snack1"] ? (
                                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                    <div className="flex items-center">
                                      <div className="relative h-16 w-16 overflow-hidden rounded-md mr-3">
                                        <Image
                                          src={menuSelections[day]["snack1"].image || "/placeholder.svg"}
                                          alt={menuSelections[day]["snack1"].name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div>
                                        <h5 className="font-medium">{menuSelections[day]["snack1"].name}</h5>
                                        <p className="text-sm text-gray-500">
                                          {menuSelections[day]["snack1"].calories} calories
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleMealSelection(day, "snack1", null)}
                                    >
                                      Change
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                    {sampleMeals["snack"].map((option) => (
                                      <div
                                        key={option.id}
                                        className="border rounded-md overflow-hidden cursor-pointer hover:border-fitnest-green transition-colors"
                                        onClick={() => handleMealSelection(day, "snack1", option)}
                                      >
                                        <div className="relative h-32 w-full">
                                          <Image
                                            src={option.image || "/placeholder.svg"}
                                            alt={option.name}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="p-2">
                                          <h5 className="font-medium text-sm">{option.name}</h5>
                                          <p className="text-xs text-gray-500">{option.calories} calories</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div key={`${day}-snack2`} className="border rounded-lg p-4">
                                <h4 className="font-medium text-base mb-4">Second Snack</h4>

                                {menuSelections[day]?.["snack2"] ? (
                                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                    <div className="flex items-center">
                                      <div className="relative h-16 w-16 overflow-hidden rounded-md mr-3">
                                        <Image
                                          src={menuSelections[day]["snack2"].image || "/placeholder.svg"}
                                          alt={menuSelections[day]["snack2"].name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div>
                                        <h5 className="font-medium">{menuSelections[day]["snack2"].name}</h5>
                                        <p className="text-sm text-gray-500">
                                          {menuSelections[day]["snack2"].calories} calories
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleMealSelection(day, "snack2", null)}
                                    >
                                      Change
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                    {sampleMeals["snack"].map((option) => (
                                      <div
                                        key={option.id}
                                        className="border rounded-md overflow-hidden cursor-pointer hover:border-fitnest-green transition-colors"
                                        onClick={() => handleMealSelection(day, "snack2", option)}
                                      >
                                        <div className="relative h-32 w-full">
                                          <Image
                                            src={option.image || "/placeholder.svg"}
                                            alt={option.name}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="p-2">
                                          <h5 className="font-medium text-sm">{option.name}</h5>
                                          <p className="text-xs text-gray-500">{option.calories} calories</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
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
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlan && (
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={selectedPlan.image || "/placeholder.svg"}
                        alt={selectedPlan.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedPlan.title}</h3>
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
                    <span>{selectedPlan?.title || "Not selected"}</span>
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
                    <span>Allergies:</span>
                    <span>
                      {selectedAllergies.length > 0
                        ? selectedAllergies.map((id) => allergies.find((a) => a.id === id)?.label).join(", ")
                        : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Days Per Week:</span>
                    <span>{selectedDays.length} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment Cycle:</span>
                    <span>{paymentCycles.find((cycle) => cycle.id === paymentCycle)?.label || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Start Date:</span>
                    <span>{startDate ? format(startDate, "MMM d, yyyy") : "Not selected"}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Price per day:</span>
                    <span>{calculateDailyPrice()} MAD</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total price:</span>
                    <span>{calculateTotalPrice()} MAD</span>
                  </div>
                </div>

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
                    Proceed to Checkout
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="w-full"
                    disabled={!selectedPlanId || selectedDays.length < 3 || selectedMealTypes.length < 2 || !startDate}
                  >
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
