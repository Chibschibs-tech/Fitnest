"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
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
  eachWeekOfInterval,
} from "date-fns"
import { AlertCircle, CheckCircle, ChevronLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// --- DATA ---
const mealPlans = {
  "weight-loss": {
    title: "Weight Loss",
    description: "Calorie-controlled meals (1200-1500 calories per day).",
    basePrice: 350, // Price per week
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
    { id: "s1", name: "Greek Yogurt", image: "/placeholder.svg", calories: 150 },
    { id: "s2", name: "Protein Energy Bites", image: "/placeholder.svg", calories: 120 },
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
    const isWeekend = isFriday(now) || isSaturday(now) || isSunday(now)
    const viewStartDate = isWeekend ? nextMonday(now) : startOfWeek(now, { weekStartsOn: 1 })
    const minDate = addHours(startOfDay(now), 48)
    return { calendarViewStartDate: viewStartDate, minSelectableDate: minDate }
  }, [])

  const calendarEndDate = useMemo(() => {
    return addDays(addWeeks(calendarViewStartDate, duration), -1)
  }, [calendarViewStartDate, duration])

  const isDateDisabled = (date: Date) => {
    return (
      isBefore(date, minSelectableDate) ||
      isBefore(date, calendarViewStartDate) ||
      !isBefore(date, addDays(calendarEndDate, 1))
    )
  }

  // --- PRICE CALCULATION ---
  const totalPrice = useMemo(() => {
    if (!selectedPlan || deliveryDays.length === 0) return 0

    // Price per meal/snack is derived from weekly base price for 7 days, 3 meals/day
    const pricePerMeal = selectedPlan.basePrice / (7 * 3)
    const pricePerSnack = pricePerMeal * 0.5

    const dailyPrice = mealsPerDay * pricePerMeal + snacksPerDay * pricePerSnack
    const total = dailyPrice * deliveryDays.length

    // Apply discount for longer durations
    if (duration === 2) return total * 0.95 // 5% discount
    if (duration === 4) return total * 0.9 // 10% discount

    return total
  }, [selectedPlan, mealsPerDay, snacksPerDay, deliveryDays, duration])

  // --- HANDLERS & VALIDATION ---
  const handleDurationChange = (value: string) => {
    setDuration(Number(value) as Duration)
    setDeliveryDays([])
    setError(null)
  }

  const handleDaySelect = (days: Date[] | undefined) => {
    setDeliveryDays(days || [])
    setError(null)
  }

  const validateStep1 = () => {
    if (deliveryDays.length === 0) {
      setError("Please select your delivery days.")
      return false
    }

    const weeksInSelection = eachWeekOfInterval(
      { start: calendarViewStartDate, end: calendarEndDate },
      { weekStartsOn: 1 },
    )

    for (const weekStart of weeksInSelection) {
      const daysInWeek = deliveryDays.filter((day) => isSameWeek(day, weekStart, { weekStartsOn: 1 }))
      if (daysInWeek.length > 0 && daysInWeek.length < 2) {
        setError(`Please select at least 2 delivery days for the week of ${format(weekStart, "MMM do")}.`)
        return false
      }
    }

    setError(null)
    return true
  }

  const validateStep2 = () => {
    for (const dateStr in menu) {
      const dayMenu = menu[dateStr]
      if (dayMenu.meals.length !== mealsPerDay) {
        setError(`Please select ${mealsPerDay} meals for ${format(new Date(dateStr), "MMM do")}.`)
        return false
      }
      if (dayMenu.snacks.length !== snacksPerDay) {
        setError(`Please select ${snacksPerDay} snacks for ${format(new Date(dateStr), "MMM do")}.`)
        return false
      }
    }
    setError(null)
    return true
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        const initialMenu: typeof menu = {}
        deliveryDays.forEach((day) => {
          initialMenu[format(day, "yyyy-MM-dd")] = { meals: [], snacks: [] }
        })
        setMenu(initialMenu)
        setStep(2)
        window.scrollTo(0, 0)
      }
    } else if (step === 2) {
      if (validateStep2()) {
        const mealPlanData = {
          planId: selectedPlanId,
          planName: selectedPlan.title,
          planPrice: totalPrice,
          duration: `${duration} weeks`,
          mealsPerWeek: Math.round(deliveryDays.length / duration),
          customizations: {
            mealsPerDay,
            snacksPerDay,
          },
          deliverySchedule: {
            frequency: `${duration} weeks`,
            selectedDays: deliveryDays.map((d) => format(d, "yyyy-MM-dd")),
            startDate: deliveryDays.length > 0 ? deliveryDays[0].toISOString() : new Date().toISOString(),
          },
          menu,
        }

        localStorage.setItem("selectedMealPlan", JSON.stringify(mealPlanData))
        router.push("/checkout")
      }
    }
  }

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
    else router.back()
    window.scrollTo(0, 0)
  }

  const handleMealSelection = (date: string, mealId: string) => {
    setMenu((prev) => {
      const currentMeals = prev[date]?.meals || []
      const newMeals = currentMeals.includes(mealId)
        ? currentMeals.filter((id) => id !== mealId)
        : [...currentMeals, mealId].slice(0, mealsPerDay)
      return { ...prev, [date]: { ...prev[date], meals: newMeals } }
    })
  }

  const handleSnackSelection = (date: string, snackId: string) => {
    setMenu((prev) => {
      const currentSnacks = prev[date]?.snacks || []
      const newSnacks = currentSnacks.includes(snackId)
        ? currentSnacks.filter((id) => id !== snackId)
        : [...currentSnacks, snackId].slice(0, snacksPerDay)
      return { ...prev, [date]: { ...prev[date], snacks: newSnacks } }
    })
  }

  // --- RENDER LOGIC ---
  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Meals and Snacks Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Label htmlFor="meals-per-day" className="text-lg font-semibold">
            Meals per day
          </Label>
          <Select value={String(mealsPerDay)} onValueChange={(v) => setMealsPerDay(Number(v))}>
            <SelectTrigger id="meals-per-day" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="snacks-per-day" className="text-lg font-semibold">
            Snacks per day
          </Label>
          <Select value={String(snacksPerDay)} onValueChange={(v) => setSnacksPerDay(Number(v))}>
            <SelectTrigger id="snacks-per-day" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
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
              <RadioGroupItem value={String(item.value)} id={`d-${item.value}`} className="sr-only" />
              <Label
                htmlFor={`d-${item.value}`}
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 h-24 hover:bg-accent [&:has([data-state=checked])]:border-primary cursor-pointer"
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
        <p className="text-sm text-muted-foreground">Choose at least 2 delivery days per week.</p>
        <div className="flex justify-center mt-4">
          <Calendar
            mode="multiple"
            selected={deliveryDays}
            onSelect={handleDaySelect}
            disabled={isDateDisabled}
            fromMonth={calendarViewStartDate}
            toMonth={calendarEndDate}
            numberOfMonths={duration === 1 ? 1 : 2}
            className="rounded-md border"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={deliveryDays.length > 0 ? format(deliveryDays[0], "yyyy-MM-dd") : undefined}
      >
        {deliveryDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd")
          const dayMenu = menu[dateStr]
          const isComplete = dayMenu && dayMenu.meals.length === mealsPerDay && dayMenu.snacks.length === snacksPerDay
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.values(sampleMeals)
                        .flat()
                        .filter((m) => m.id.startsWith("l") || m.id.startsWith("d"))
                        .map((meal) => (
                          <Button
                            key={meal.id}
                            variant={dayMenu?.meals.includes(meal.id) ? "default" : "outline"}
                            onClick={() => handleMealSelection(dateStr, meal.id)}
                            className="h-auto py-2"
                          >
                            <div className="flex flex-col items-center text-center">
                              <Image
                                src={meal.image || "/placeholder.svg"}
                                alt={meal.name}
                                width={60}
                                height={60}
                                className="rounded-md mb-1"
                              />
                              <span className="text-xs leading-tight">{meal.name}</span>
                            </div>
                          </Button>
                        ))}
                    </div>
                  </div>
                  {snacksPerDay > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">
                        Snacks ({dayMenu?.snacks.length || 0}/{snacksPerDay})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {sampleMeals.snack.map((snack) => (
                          <Button
                            key={snack.id}
                            variant={dayMenu?.snacks.includes(snack.id) ? "default" : "outline"}
                            onClick={() => handleSnackSelection(dateStr, snack.id)}
                            className="h-auto py-2"
                          >
                            <div className="flex flex-col items-center text-center">
                              <Image
                                src={snack.image || "/placeholder.svg"}
                                alt={snack.name}
                                width={60}
                                height={60}
                                className="rounded-md mb-1"
                              />
                              <span className="text-xs leading-tight">{snack.name}</span>
                            </div>
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
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Incomplete Menu</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )

  const renderSummary = () => (
    <div className="lg:col-span-1">
      <div className="sticky top-20">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPlan && (
              <div className="flex items-center space-x-4">
                <Image
                  src={selectedPlan.image || "/placeholder.svg"}
                  alt={selectedPlan.title}
                  width={64}
                  height={64}
                  className="rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{selectedPlan.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {mealsPerDay} meals, {snacksPerDay} snacks
                  </p>
                </div>
              </div>
            )}
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Duration:</span>{" "}
                <span>
                  {duration} week{duration > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Days:</span> <span>{deliveryDays.length}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{totalPrice.toFixed(2)} MAD</span>
            </div>
            <div className="rounded-md bg-gray-50 p-3">
              <div className="flex">
                <Info className="h-5 w-5 text-fitnest-orange mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">You can pause, modify, or cancel your subscription anytime.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" onClick={handlePrevStep} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">Customize Your Perfect Meal Plan</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Step {step}: {step === 1 ? "Plan Details" : "Build Your Menu"}
              </CardTitle>
            </CardHeader>
            <CardContent>{step === 1 ? renderStep1() : renderStep2()}</CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNextStep} size="lg">
                {step === 1 ? "Next: Build Menu" : "Proceed to Checkout"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        {renderSummary()}
      </div>
    </div>
  )
}
