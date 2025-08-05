"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  format,
  addDays,
  isBefore,
  addHours,
  addWeeks,
  startOfDay,
  isFriday,
  isSaturday,
  isSunday,
  nextMonday,
  isSameWeek,
  startOfWeek,
} from "date-fns"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- DATA (Keep as is) ---
const mealPlans = {
  "weight-loss": {
    title: "Weight Loss",
    description: "Calorie-controlled meals (1200-1500 calories per day).",
    basePrice: 350,
    image: "/vibrant-weight-loss-meal.png",
  },
  "stay-fit": {
    title: "Stay Fit",
    description: "Well-rounded meals (1600-1900 calories per day).",
    basePrice: 320,
    image: "/vibrant-nutrition-plate.png",
  },
  "muscle-gain": {
    title: "Muscle Gain",
    description: "Protein-rich meals (2200-2500 calories per day).",
    basePrice: 400,
    image: "/hearty-muscle-meal.png",
  },
  keto: {
    title: "Keto",
    description: "Low-carb, high-fat meals (1700-1900 calories per day).",
    basePrice: 380,
    image: "/colorful-keto-plate.png",
  },
}

const sampleMeals = {
  breakfast: [
    { id: "b1", name: "Fluffy Protein Stack", image: "/fluffy-protein-stack.png", calories: 320 },
    { id: "b2", name: "Layered Berry Parfait", image: "/layered-berry-parfait.png", calories: 280 },
  ],
  lunch: [
    { id: "l1", name: "Grilled Chicken Medley", image: "/grilled-chicken-vegetable-medley.png", calories: 420 },
    { id: "l2", name: "Rainbow Grain Bowl", image: "/rainbow-grain-bowl.png", calories: 380 },
  ],
  dinner: [
    { id: "d1", name: "Pan Seared Salmon", image: "/pan-seared-salmon-quinoa.png", calories: 480 },
    { id: "d2", name: "Savory Turkey Meatballs", image: "/savory-turkey-meatballs.png", calories: 420 },
  ],
  snack: [
    { id: "s1", name: "Greek Yogurt", image: "/placeholder.svg?key=tsc4q", calories: 150 },
    { id: "s2", name: "Protein Energy Bites", image: "/placeholder.svg?key=l7j8m", calories: 120 },
  ],
}

// --- TYPES ---
type Duration = 1 | 2 | 4 // in weeks

export function OrderProcess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planIdFromUrl = searchParams.get("plan")

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1)
  const [selectedPlanId, setSelectedPlanId] = useState<string>(planIdFromUrl || "stay-fit")
  const [mealsPerDay, setMealsPerDay] = useState(2)
  const [snacksPerDay, setSnacksPerDay] = useState(1)
  const [duration, setDuration] = useState<Duration>(1)
  const [deliveryDays, setDeliveryDays] = useState<Date[]>([])
  const [menu, setMenu] = useState<Record<string, { meals: string[]; snacks: string[] }>>({})
  const [error, setError] = useState<string | null>(null)

  const selectedPlan = mealPlans[selectedPlanId as keyof typeof mealPlans]

  // --- ROBUST DATE & CALENDAR LOGIC ---
  const { calendarViewStartDate, minSelectableDate } = useMemo(() => {
    const now = new Date()
    // The "Friday Rule": If it's Friday, Saturday, or Sunday, start everything from next week.
    const isWeekend = isFriday(now) || isSaturday(now) || isSunday(now)
    const viewStartDate = isWeekend ? nextMonday(now) : startOfWeek(now, { weekStartsOn: 1 })
    // 48-hour buffer from the actual current time
    const minDate = addHours(startOfDay(now), 48)

    return {
      calendarViewStartDate: viewStartDate,
      minSelectableDate: minDate,
    }
  }, [])

  const calendarEndDate = useMemo(() => {
    // The calendar view should extend for the selected duration
    return addDays(addWeeks(calendarViewStartDate, duration), -1)
  }, [calendarViewStartDate, duration])

  const isDateDisabled = (date: Date) => {
    // Disable dates before the 48-hour minimum and outside the calculated duration view
    return (
      isBefore(date, minSelectableDate) ||
      isBefore(date, calendarViewStartDate) ||
      !isBefore(date, addDays(calendarEndDate, 1))
    )
  }

  // --- HANDLERS & VALIDATION ---
  const handleDurationChange = (value: string) => {
    setDuration(Number(value) as Duration)
    setDeliveryDays([]) // Reset selected days when duration changes
    setError(null)
  }

  const handleDaySelect = (days: Date[] | undefined) => {
    setDeliveryDays(days || [])
    setError(null) // Clear previous errors on new selection
  }

  const validateStep1 = () => {
    // Create an array of week start dates to validate against
    const weeksToValidate: Date[] = []
    for (let i = 0; i < duration; i++) {
      weeksToValidate.push(addWeeks(calendarViewStartDate, i))
    }

    // Check each week for the minimum number of delivery days
    for (const weekStart of weeksToValidate) {
      const daysInWeek = deliveryDays.filter((day) => isSameWeek(day, weekStart, { weekStartsOn: 1 }))
      if (daysInWeek.length < 2) {
        setError(`Please select at least 2 delivery days for the week of ${format(weekStart, "MMM do")}.`)
        return false // Validation failed
      }
    }

    if (deliveryDays.length === 0) {
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
        const initialMenu: typeof menu = {}
        deliveryDays.forEach((day) => {
          initialMenu[format(day, "yyyy-MM-dd")] = { meals: [], snacks: [] }
        })
        setMenu(initialMenu)
        setStep(2)
        window.scrollTo(0, 0)
      }
    } else if (step === 2) {
      // Add validation for step 2 if needed
      console.log("Final Order State:", {
        selectedPlanId,
        mealsPerDay,
        snacksPerDay,
        duration,
        deliveryDays,
        menu,
      })
      router.push("/checkout")
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    } else {
      router.back()
    }
  }

  const handleMealSelection = (date: string, mealId: string) => {
    setMenu((prev) => {
      const currentMeals = prev[date]?.meals || []
      const newMeals = currentMeals.includes(mealId)
        ? currentMeals.filter((id) => id !== mealId)
        : [...currentMeals, mealId].slice(0, mealsPerDay)
      return {
        ...prev,
        [date]: { ...prev[date], meals: newMeals },
      }
    })
  }

  const handleSnackSelection = (date: string, snackId: string) => {
    setMenu((prev) => {
      const currentSnacks = prev[date]?.snacks || []
      const newSnacks = currentSnacks.includes(snackId)
        ? currentSnacks.filter((id) => id !== snackId)
        : [...currentSnacks, snackId].slice(0, snacksPerDay)
      return {
        ...prev,
        [date]: { ...prev[date], snacks: newSnacks },
      }
    })
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
              {/* Meals and Snacks Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="meals-per-day" className="text-lg font-semibold">
                    Meals per day
                  </Label>
                  <Select value={String(mealsPerDay)} onValueChange={(value) => setMealsPerDay(Number(value))}>
                    <SelectTrigger id="meals-per-day" className="mt-2">
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
                  <Select value={String(snacksPerDay)} onValueChange={(value) => setSnacksPerDay(Number(value))}>
                    <SelectTrigger id="snacks-per-day" className="mt-2">
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

              {/* Subscription Duration */}
              <div>
                <Label className="text-lg font-semibold">Subscription Duration</Label>
                <RadioGroup
                  value={String(duration)}
                  onValueChange={handleDurationChange}
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
                        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 h-24 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Dynamic Delivery Days Calendar */}
              <div>
                <Label className="text-lg font-semibold">Select Delivery Days</Label>
                <p className="text-sm text-muted-foreground">
                  Choose at least 2 delivery days per week for your selected duration.
                </p>
                <div className="flex justify-center mt-4">
                  <Calendar
                    mode="multiple"
                    selected={deliveryDays}
                    onSelect={handleDaySelect}
                    disabled={isDateDisabled}
                    fromMonth={calendarViewStartDate}
                    toMonth={calendarEndDate}
                    numberOfMonths={duration === 4 ? 2 : 1}
                    className="rounded-md border"
                  />
                </div>
              </div>

              {/*
                HIDDEN: Payment Cycle feature is deactivated as requested.
                The code is kept for future use if needed.
              */}

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Validation Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === 2 && (
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={deliveryDays.length > 0 ? format(deliveryDays[0], "yyyy-MM-dd") : undefined}
            >
              {deliveryDays.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd")
                const dayMenu = menu[dateStr]
                const isComplete =
                  dayMenu && dayMenu.meals.length === mealsPerDay && dayMenu.snacks.length === snacksPerDay
                return (
                  <AccordionItem value={dateStr} key={dateStr}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full pr-4">
                        <span>{format(day, "EEEE, MMMM do")}</span>
                        {isComplete && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 p-2">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Meals ({dayMenu?.meals.length || 0}/{mealsPerDay})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.values(sampleMeals)
                              .flat()
                              .map((meal) => (
                                <Button
                                  key={meal.id}
                                  variant={dayMenu?.meals.includes(meal.id) ? "default" : "outline"}
                                  onClick={() => handleMealSelection(dateStr, meal.id)}
                                >
                                  {meal.name}
                                </Button>
                              ))}
                          </div>
                        </div>
                        {snacksPerDay > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              Snacks ({dayMenu?.snacks.length || 0}/{snacksPerDay})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {sampleMeals.snack.map((snack) => (
                                <Button
                                  key={snack.id}
                                  variant={dayMenu?.snacks.includes(snack.id) ? "default" : "outline"}
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
