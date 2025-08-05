"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  addDays,
  addWeeks,
  startOfDay,
  isFriday,
  isSaturday,
  isSunday,
  nextMonday,
  format,
  isSameWeek,
  startOfWeek,
  isBefore,
  addHours,
  getDay,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle } from "lucide-react"

// Mock data for meals, replace with actual data fetching
const sampleMeals = [
  { id: "meal-1", name: "Grilled Chicken Salad" },
  { id: "meal-2", name: "Salmon with Quinoa" },
  { id: "meal-3", name: "Vegan Lentil Soup" },
  { id: "meal-4", name: "Beef Stir-fry" },
]

const sampleSnacks = [
  { id: "snack-1", name: "Protein Bar" },
  { id: "snack-2", name: "Apple Slices with Peanut Butter" },
  { id: "snack-3", name: "Greek Yogurt" },
]

type MealPlanType = "weight-loss" | "muscle-gain" | "keto"
type Duration = 1 | 2 | 4 // in weeks

interface OrderState {
  planType: MealPlanType
  mealsPerDay: number
  snacksPerDay: number
  duration: Duration
  deliveryDays: Date[]
  menu: Record<string, { meals: string[]; snacks: string[] }>
}

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
const sampleMealsOld = {
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
  const [step, setStep] = useState(1)
  const [orderState, setOrderState] = useState<OrderState>({
    planType: "weight-loss",
    mealsPerDay: 2,
    snacksPerDay: 1,
    duration: 1,
    deliveryDays: [],
    menu: {},
  })
  const [error, setError] = useState<string | null>(null)

  // --- Robust Date and Calendar Logic ---

  const { calendarViewStartDate, minSelectableDate } = useMemo(() => {
    const now = new Date()
    const minDate = addDays(startOfDay(now), 2) // 48-hour buffer

    let viewStartDate = startOfWeek(now, { weekStartsOn: 1 }) // Start view on Monday

    // The "Friday Rule": If it's Friday, Saturday, or Sunday, start everything from next week.
    if (isFriday(now) || isSaturday(now) || isSunday(now)) {
      viewStartDate = nextMonday(now)
    }

    return {
      calendarViewStartDate: viewStartDate,
      minSelectableDate: minDate,
    }
  }, [])

  const calendarEndDate = useMemo(() => {
    // The calendar view should extend for the selected duration
    return addWeeks(calendarViewStartDate, orderState.duration)
  }, [calendarViewStartDate, orderState.duration])

  const isDateDisabled = (date: Date) => {
    // Disable dates before the 48-hour minimum and outside the calculated duration view
    return isBefore(date, minSelectableDate) || !isBefore(date, calendarEndDate)
  }

  // --- Handlers and Validation ---

  const handleDaySelect = (day: Date | undefined) => {
    if (!day || isDateDisabled(day)) return

    const newDeliveryDays = orderState.deliveryDays.some((d) => d.getTime() === day.getTime())
      ? orderState.deliveryDays.filter((d) => d.getTime() !== day.getTime())
      : [...orderState.deliveryDays, day]

    setOrderState((prev) => ({
      ...prev,
      deliveryDays: newDeliveryDays.sort((a, b) => a.getTime() - b.getTime()),
    }))
    setError(null) // Clear previous errors on new selection
  }

  const validateStep1 = () => {
    // Create an array of week start dates to validate against
    const weeksToValidate: Date[] = []
    for (let i = 0; i < orderState.duration; i++) {
      weeksToValidate.push(addWeeks(calendarViewStartDate, i))
    }

    // Check each week for the minimum number of delivery days
    for (const weekStart of weeksToValidate) {
      const daysInWeek = orderState.deliveryDays.filter((day) => isSameWeek(day, weekStart, { weekStartsOn: 1 }))
      if (daysInWeek.length < 2) {
        setError(`Please select at least 2 delivery days for the week of ${format(weekStart, "MMM do")}.`)
        return false // Validation failed
      }
    }

    if (orderState.deliveryDays.length === 0) {
      setError("Please select your delivery days.")
      return false
    }

    setError(null) // All checks passed
    return true
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        // Initialize menu for step 2
        const initialMenu: OrderState["menu"] = {}
        orderState.deliveryDays.forEach((day) => {
          initialMenu[format(day, "yyyy-MM-dd")] = { meals: [], snacks: [] }
        })
        setOrderState((prev) => ({ ...prev, menu: initialMenu }))
        setStep(2)
      }
    } else if (step === 2) {
      // Add validation for step 2 if needed
      // For now, just navigate
      router.push("/checkout")
    }
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleMealSelection = (date: string, mealId: string) => {
    setOrderState((prev) => {
      const currentMeals = prev.menu[date]?.meals || []
      const newMeals = currentMeals.includes(mealId)
        ? currentMeals.filter((id) => id !== mealId)
        : [...currentMeals, mealId].slice(0, prev.mealsPerDay)
      return {
        ...prev,
        menu: {
          ...prev.menu,
          [date]: { ...prev.menu[date], meals: newMeals },
        },
      }
    })
  }

  const handleSnackSelection = (date: string, snackId: string) => {
    setOrderState((prev) => {
      const currentSnacks = prev.menu[date]?.snacks || []
      const newSnacks = currentSnacks.includes(snackId)
        ? currentSnacks.filter((id) => id !== snackId)
        : [...currentSnacks, snackId].slice(0, prev.snacksPerDay)
      return {
        ...prev,
        menu: {
          ...prev.menu,
          [date]: { ...prev.menu[date], snacks: newSnacks },
        },
      }
    })
  }

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
  const handleMealSelectionOld = (day: string, mealType: string, meal: any) => {
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
        // Save meal plan data to localStorage before going to checkout
        const mealPlanData = {
          planId: selectedPlanId,
          planName: selectedPlan?.title,
          planPrice: calculateTotalPrice(),
          duration: paymentCycle === "weekly" ? "1 week" : paymentCycle === "monthly" ? "4 weeks" : "12 weeks",
          mealsPerWeek: selectedDays.length,
          customizations: {
            dietaryRestrictions: selectedAllergies
              .map((id) => allergies.find((a) => a.id === id)?.label)
              .filter(Boolean),
            mealTypes: selectedMealTypes,
            snacks: selectedSnacks,
          },
          deliverySchedule: {
            frequency: paymentCycle,
            selectedDays: selectedDays,
            startDate: startDate?.toISOString(),
          },
        }

        // Save to localStorage
        localStorage.setItem("selectedMealPlan", JSON.stringify(mealPlanData))
        console.log("Saved meal plan data to localStorage:", mealPlanData)

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
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Step {step}: {step === 1 ? "Customize Your Plan" : "Build Your Menu"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1
              ? "Select your preferences to create the perfect meal plan."
              : "Choose your meals and snacks for each delivery day."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-8">
              {/* Plan Type */}
              <div>
                <Label className="text-lg font-semibold">Plan Type</Label>
                <RadioGroup
                  value={orderState.planType}
                  onValueChange={(value: MealPlanType) => setOrderState((prev) => ({ ...prev, planType: value }))}
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  {["weight-loss", "muscle-gain", "keto"].map((plan) => (
                    <div key={plan}>
                      <RadioGroupItem value={plan} id={plan} className="sr-only" />
                      <Label
                        htmlFor={plan}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary capitalize cursor-pointer"
                      >
                        {plan.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Meals and Snacks */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="meals-per-day" className="text-lg font-semibold">
                    Meals per day
                  </Label>
                  <Select
                    value={String(orderState.mealsPerDay)}
                    onValueChange={(value) =>
                      setOrderState((prev) => ({
                        ...prev,
                        mealsPerDay: Number(value),
                      }))
                    }
                  >
                    <SelectTrigger id="meals-per-day">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="snacks-per-day" className="text-lg font-semibold">
                    Snacks per day
                  </Label>
                  <Select
                    value={String(orderState.snacksPerDay)}
                    onValueChange={(value) =>
                      setOrderState((prev) => ({
                        ...prev,
                        snacksPerDay: Number(value),
                      }))
                    }
                  >
                    <SelectTrigger id="snacks-per-day">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* NEW: Subscription Duration */}
              <div>
                <Label className="text-lg font-semibold">Subscription Duration</Label>
                <RadioGroup
                  value={String(orderState.duration)}
                  onValueChange={(value) =>
                    setOrderState((prev) => ({
                      ...prev,
                      duration: Number(value) as Duration,
                      deliveryDays: [], // Reset selected days when duration changes
                    }))
                  }
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  {[
                    { value: 1, label: "1 Week" },
                    { value: 2, label: "2 Weeks" },
                    { value: 4, label: "1 Month" },
                  ].map((item) => (
                    <div key={item.value}>
                      <RadioGroupItem value={String(item.value)} id={`duration-${item.value}`} className="sr-only" />
                      <Label
                        htmlFor={`duration-${item.value}`}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* NEW: Dynamic Delivery Days Calendar */}
              <div>
                <Label className="text-lg font-semibold">Select Delivery Days</Label>
                <p className="text-sm text-muted-foreground">
                  Choose at least 2 delivery days per week for your selected duration.
                </p>
                <div className="flex justify-center mt-4">
                  <Calendar
                    mode="multiple"
                    selected={orderState.deliveryDays}
                    onSelect={handleDaySelect}
                    disabled={isDateDisabled}
                    fromMonth={calendarViewStartDate}
                    toMonth={calendarEndDate}
                    // Show more months for longer durations for better UX
                    numberOfMonths={orderState.duration === 4 ? 2 : 1}
                    className="rounded-md border"
                  />
                </div>
              </div>

              {/*
                HIDDEN: Payment Cycle feature is deactivated as requested.
                The code is kept for future use.

                <div>
                  <Label className="text-lg font-semibold">Payment Cycle</Label>
                  ...
                </div>
              */}
            </div>
          )}

          {step === 2 && (
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={
                orderState.deliveryDays.length > 0 ? format(orderState.deliveryDays[0], "yyyy-MM-dd") : undefined
              }
            >
              {orderState.deliveryDays.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd")
                const dayMenu = orderState.menu[dateStr]
                const isComplete =
                  dayMenu.meals.length === orderState.mealsPerDay && dayMenu.snacks.length === orderState.snacksPerDay
                return (
                  <AccordionItem value={dateStr} key={dateStr}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full pr-4">
                        <span>{format(day, "EEEE, MMMM do")}</span>
                        {isComplete && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Meals ({dayMenu.meals.length}/{orderState.mealsPerDay})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sampleMeals.map((meal) => (
                              <Button
                                key={meal.id}
                                variant={dayMenu.meals.includes(meal.id) ? "default" : "outline"}
                                onClick={() => handleMealSelection(dateStr, meal.id)}
                              >
                                {meal.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                        {orderState.snacksPerDay > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              Snacks ({dayMenu.snacks.length}/{orderState.snacksPerDay})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {sampleSnacks.map((snack) => (
                                <Button
                                  key={snack.id}
                                  variant={dayMenu.snacks.includes(snack.id) ? "default" : "outline"}
                                  onClick={() => handleSnackSelection(dateStr, snack.id)}
                                >
                                  {snack.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevStep} disabled={step === 1}>
            Previous
          </Button>
          <Button onClick={handleNextStep}>{step === 1 ? "Next: Build Menu" : "Proceed to Checkout"}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
