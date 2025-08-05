"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  format,
  addHours,
  isBefore,
  getDay,
  nextMonday,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isWithinInterval,
} from "date-fns"
import { Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { allMealPlans } from "@/lib/meal-plan-data"

// Data
const durationOptions = [
  { id: "1-week", label: "1 Week", weeks: 1 },
  { id: "2-weeks", label: "2 Weeks", weeks: 2 },
  { id: "1-month", label: "1 Month", weeks: 4 },
]

// Helper to determine the start of the selection period
const getCalendarStartInfo = () => {
  const now = new Date()
  const firstSelectableDate = addHours(now, 48)
  let calendarViewStart = startOfWeek(now, { weekStartsOn: 1 })

  const dayOfWeek = getDay(now) // Sunday is 0
  if (dayOfWeek >= 5) {
    // Friday, Saturday, Sunday
    calendarViewStart = nextMonday(now)
  }

  return { calendarViewStart, firstSelectableDate }
}

function OrderProcessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planIdFromUrl = searchParams.get("plan")

  const selectedPlan = useMemo(() => {
    if (!planIdFromUrl) return null
    return allMealPlans.find((p) => p.id === planIdFromUrl)
  }, [planIdFromUrl])

  // State
  const [step, setStep] = useState(1)
  const [duration, setDuration] = useState("1-week")
  const [selectedDays, setSelectedDays] = useState<Date[]>([])
  const [menuSelections, setMenuSelections] = useState<Record<string, Record<string, string[]>>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [displayMonth, setDisplayMonth] = useState<Date>()

  // Memoized values for performance
  const { calendarViewStart, firstSelectableDate } = useMemo(getCalendarStartInfo, [])
  const weeksInDuration = useMemo(() => durationOptions.find((d) => d.id === duration)?.weeks || 1, [duration])
  const calendarEndDate = useMemo(
    () => endOfWeek(addWeeks(calendarViewStart, weeksInDuration - 1)),
    [calendarViewStart, weeksInDuration],
  )

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
    const dailyPrice = selectedPlan.price / 7
    return Math.round(dailyPrice * selectedDays.length)
  }, [selectedPlan, selectedDays])

  // Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedPlan) newErrors.mealPlan = "Please select a meal plan."

    for (let i = 0; i < weeksInDuration; i++) {
      const weekStart = addWeeks(startOfWeek(calendarViewStart, { weekStartsOn: 1 }), i)
      const selectedInWeek = selectedDays.filter((day) =>
        isWithinInterval(day, { start: weekStart, end: endOfWeek(weekStart, { weekStartsOn: 1 }) }),
      )
      if (selectedInWeek.length < 2) {
        newErrors.days = `Please select at least 2 days for the week of ${format(weekStart, "MMM d")}.`
        break
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isMenuComplete = useMemo(() => {
    if (selectedDays.length === 0 || !selectedPlan) return false
    return selectedDays.every((day) => {
      const dayISO = day.toISOString().split("T")[0]
      const dayMenu = menuSelections[dayISO]
      // Simplified check: just ensure the menu for the day exists
      return dayMenu && dayMenu.meals?.length > 0
    })
  }, [menuSelections, selectedDays, selectedPlan])

  // Handlers
  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        const initialMenu: typeof menuSelections = {}
        selectedDays.forEach((day) => {
          initialMenu[day.toISOString().split("T")[0]] = { meals: [], snacks: [] }
        })
        setMenuSelections(initialMenu)
        setStep(2)
        window.scrollTo(0, 0)
      }
    } else {
      // Proceed to checkout logic
      router.push("/checkout")
    }
  }

  if (!selectedPlan) {
    return (
      <div className="container mx-auto py-12 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid Meal Plan</AlertTitle>
          <AlertDescription>
            The meal plan you selected does not exist. Please go back and select a valid plan.
          </AlertDescription>
        </Alert>
        <Link href="/meal-plans" className="mt-4 inline-block">
          <Button>View All Meal Plans</Button>
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
                <CardDescription>Select your subscription duration and delivery days.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <Label className="text-base font-medium mb-3 block">1. Select duration</Label>
                  <RadioGroup value={duration} onValueChange={setDuration} className="grid grid-cols-3 gap-4 mb-4">
                    {durationOptions.map((option) => (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={`duration-${option.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`duration-${option.id}`}
                          className="flex items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-fitnest-green [&:has([data-state=checked])]:border-fitnest-green cursor-pointer"
                        >
                          <span className="font-semibold">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label className="text-base font-medium mb-3 block">2. Select delivery days</Label>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-gray-600 mb-4">Select at least 2 delivery days for each week.</p>
                    <Calendar
                      mode="multiple"
                      selected={selectedDays}
                      onSelect={(days) => setSelectedDays(days || [])}
                      month={displayMonth}
                      onMonthChange={setDisplayMonth}
                      numberOfMonths={duration === "1-month" ? 2 : 1}
                      disabled={(date) =>
                        isBefore(date, firstSelectableDate) ||
                        !isWithinInterval(date, { start: calendarViewStart, end: calendarEndDate })
                      }
                      className="p-0"
                    />
                  </div>
                  {errors.days && <p className="text-red-500 text-sm mt-2">{errors.days}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleNext} className="w-full" disabled={selectedDays.length === 0}>
                  Continue to Menu Building
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Menu Building */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Build Your Menu</CardTitle>
                <CardDescription>We'll select meals based on your plan. You can proceed to checkout.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {selectedDays.map((day) => {
                    const dayISO = day.toISOString().split("T")[0]
                    return (
                      <AccordionItem value={dayISO} key={dayISO}>
                        <AccordionTrigger className="flex justify-between w-full">
                          <span>{format(day, "EEEE, MMM d")}</span>
                          <Check className="h-5 w-5 text-green-500" />
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-gray-600">
                            Our chefs will curate a delicious selection of meals from the{" "}
                            <span className="font-semibold">{selectedPlan.name}</span> for this day.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleNext}>Proceed to Checkout</Button>
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
                <div className="flex items-center space-x-4">
                  <Image
                    src={selectedPlan.image || "/placeholder.svg"}
                    alt={selectedPlan.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{selectedPlan.name}</h3>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{durationOptions.find((d) => d.id === duration)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Days:</span>
                    <span>{selectedDays.length} days</span>
                  </div>
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

export function OrderProcess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderProcessContent />
    </Suspense>
  )
}
