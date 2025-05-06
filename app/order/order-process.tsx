"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { format, addDays } from "date-fns"
import { CalendarIcon, ChevronLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Define meal plan data
const mealPlans = {
  "weight-loss": {
    title: "Weight Loss Meal Plan",
    description: "Calorie-controlled meals designed to help you lose weight while staying satisfied.",
    basePrice: 350,
    image: "/vibrant-weight-loss-meal.png",
  },
  "balanced-nutrition": {
    title: "Balanced Nutrition Meal Plan",
    description: "Well-rounded meals with optimal proportions of proteins, carbs, and healthy fats.",
    basePrice: 320,
    image: "/vibrant-nutrition-plate.png",
  },
  "muscle-gain": {
    title: "Muscle Gain Meal Plan",
    description: "Protein-rich meals to support muscle growth and recovery after workouts.",
    basePrice: 400,
    image: "/hearty-muscle-meal.png",
  },
  keto: {
    title: "Keto Meal Plan",
    description: "Low-carb, high-fat meals designed to help you achieve and maintain ketosis.",
    basePrice: 380,
    image: "/colorful-keto-plate.png",
  },
}

const mealFrequencies = [
  { id: "1-meal", label: "1 Meal / Day", description: "Lunch or Dinner", multiplier: 0.6 },
  { id: "2-meals", label: "2 Meals / Day", description: "Lunch and Dinner", multiplier: 1 },
  { id: "3-meals", label: "3 Meals / Day", description: "Breakfast, Lunch, and Dinner", multiplier: 1.4 },
]

const snackOptions = [
  { id: "0-snacks", label: "No Snacks", description: "No additional snacks", multiplier: 0 },
  { id: "1-snack", label: "1 Snack / Day", description: "One healthy snack per day", multiplier: 0.2 },
  { id: "2-snacks", label: "2 Snacks / Day", description: "Two healthy snacks per day", multiplier: 0.35 },
]

const subscriptionPeriods = [
  { id: "3-days", label: "3 Days", description: "Trial period", multiplier: 0.3 },
  { id: "1-week", label: "1 Week", description: "Try it out", multiplier: 1 },
  { id: "2-weeks", label: "2 Weeks", description: "Short commitment", multiplier: 0.97 },
  { id: "4-weeks", label: "4 Weeks", description: "Most popular", multiplier: 0.95, popular: true },
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
    { id: "s1", name: "Greek Yogurt with Berries", image: "/placeholder.svg?key=eepi7", calories: 150 },
    { id: "s2", name: "Protein Energy Bites", image: "/placeholder.svg?key=g14cg", calories: 120 },
    { id: "s3", name: "Mixed Nuts and Dried Fruits", image: "/placeholder.svg?key=e7zmo", calories: 180 },
    { id: "s4", name: "Vegetable Sticks with Hummus", image: "/placeholder.svg?key=dguid", calories: 130 },
  ],
}

export function OrderProcess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan") || "weight-loss"
  const plan = mealPlans[planId as keyof typeof mealPlans] || mealPlans["weight-loss"]

  const [selectedFrequency, setSelectedFrequency] = useState(mealFrequencies[1].id)
  const [selectedSnacks, setSelectedSnacks] = useState(snackOptions[0].id)
  const [selectedPeriod, setSelectedPeriod] = useState(subscriptionPeriods[3].id)
  const [startDate, setStartDate] = useState<Date | undefined>(addDays(new Date(), 2))
  const [step, setStep] = useState(1)

  // Menu building state
  const [menuDays, setMenuDays] = useState<any[]>([])

  // Calculate number of days based on selected period
  const getDaysCount = () => {
    switch (selectedPeriod) {
      case "3-days":
        return 3
      case "1-week":
        return 7
      case "2-weeks":
        return 14
      case "4-weeks":
        return 28
      default:
        return 7
    }
  }

  // Initialize menu days when period changes or when entering menu building step
  const initializeMenuDays = () => {
    const daysCount = getDaysCount()
    const startDateObj = startDate || addDays(new Date(), 2)

    const newMenuDays = []
    for (let i = 0; i < daysCount; i++) {
      const currentDate = addDays(startDateObj, i)
      const dayName = format(currentDate, "EEEE")
      const dateString = format(currentDate, "MMM d")

      // Determine which meal types to include based on selected frequency
      let mealTypes = []
      if (selectedFrequency === "1-meal") {
        mealTypes = ["lunch"]
      } else if (selectedFrequency === "2-meals") {
        mealTypes = ["lunch", "dinner"]
      } else if (selectedFrequency === "3-meals") {
        mealTypes = ["breakfast", "lunch", "dinner"]
      }

      // Add snacks if selected
      if (selectedSnacks === "1-snack") {
        mealTypes.push("snack")
      } else if (selectedSnacks === "2-snacks") {
        mealTypes.push("snack", "snack")
      }

      // Create day object with empty meal selections
      const dayObj = {
        day: i + 1,
        dayName,
        dateString,
        meals: mealTypes.map((type) => ({
          type,
          selected: null,
        })),
      }

      newMenuDays.push(dayObj)
    }

    setMenuDays(newMenuDays)
  }

  // Calculate price
  const calculatePrice = () => {
    const basePrice = plan.basePrice
    const frequencyMultiplier = mealFrequencies.find((option) => option.id === selectedFrequency)?.multiplier || 1
    const snackMultiplier = snackOptions.find((option) => option.id === selectedSnacks)?.multiplier || 0
    const periodMultiplier = subscriptionPeriods.find((option) => option.id === selectedPeriod)?.multiplier || 1

    return Math.round(basePrice * (frequencyMultiplier + snackMultiplier) * periodMultiplier)
  }

  const totalPrice = calculatePrice()

  const handleNext = () => {
    if (step < 3) {
      if (step === 1 && step + 1 === 3) {
        // Initialize menu days when going from step 1 to step 3 (skipping step 2)
        initializeMenuDays()
      }
      setStep(step + 1)
      window.scrollTo(0, 0)
    } else {
      // Submit order
      router.push("/checkout")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    } else {
      router.push(`/meal-plans/${planId}`)
    }
  }

  // Handle meal selection for menu building
  const handleMealSelection = (dayIndex: number, mealIndex: number, meal: any) => {
    const updatedMenuDays = [...menuDays]
    updatedMenuDays[dayIndex].meals[mealIndex].selected = meal
    setMenuDays(updatedMenuDays)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {step === 1 ? "Back to Meal Plan" : "Back"}
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Customize Your Order</h1>
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
                <CardTitle>Choose Your Meal Options</CardTitle>
                <CardDescription>Customize your meal plan to fit your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Meals Per Day</Label>
                  <RadioGroup
                    value={selectedFrequency}
                    onValueChange={setSelectedFrequency}
                    className="grid gap-4 md:grid-cols-3"
                  >
                    {mealFrequencies.map((option) => (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={`frequency-${option.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`frequency-${option.id}`}
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

                <div>
                  <Label className="text-base font-medium mb-3 block">Additional Snacks</Label>
                  <RadioGroup
                    value={selectedSnacks}
                    onValueChange={setSelectedSnacks}
                    className="grid gap-4 md:grid-cols-3"
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

                <div>
                  <Label className="text-base font-medium mb-3 block">Subscription Period</Label>
                  <RadioGroup
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                    className="grid gap-4 md:grid-cols-4"
                  >
                    {subscriptionPeriods.map((option) => (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={`period-${option.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`period-${option.id}`}
                          className="relative flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-fitnest-green [&:has([data-state=checked])]:border-fitnest-green"
                        >
                          {option.popular && (
                            <div className="absolute -top-2 -right-2 bg-fitnest-orange text-white text-xs px-2 py-1 rounded-full">
                              Popular
                            </div>
                          )}
                          <div className="text-center">
                            <h3 className="font-semibold">{option.label}</h3>
                            <p className="text-sm text-gray-500">{option.description}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

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
                          disabled={(date) => date < addDays(new Date(), 1)}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-sm text-gray-500">We need at least 24 hours to prepare your first delivery.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    initializeMenuDays()
                    setStep(3) // Skip step 2 and go directly to menu building
                  }}
                  disabled={!startDate}
                >
                  Continue to Menu Building
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Build Your Menu</CardTitle>
                <CardDescription>Select your meals for each day of your subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {menuDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      Day {day.day}: {day.dayName} ({day.dateString})
                    </h3>
                    <div className="space-y-4">
                      {day.meals.map((meal: any, mealIndex: number) => (
                        <div key={mealIndex} className="border-t pt-4 first:border-t-0 first:pt-0">
                          <h4 className="font-medium text-base mb-2 capitalize">
                            {meal.type === "snack" && mealIndex > 0 && day.meals[mealIndex - 1].type === "snack"
                              ? "Second Snack"
                              : meal.type}
                          </h4>

                          {meal.selected ? (
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center">
                                <div className="relative h-16 w-16 overflow-hidden rounded-md mr-3">
                                  <Image
                                    src={meal.selected.image || "/placeholder.svg"}
                                    alt={meal.selected.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h5 className="font-medium">{meal.selected.name}</h5>
                                  <p className="text-sm text-gray-500">{meal.selected.calories} calories</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMealSelection(dayIndex, mealIndex, null)}
                              >
                                Change
                              </Button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                              {sampleMeals[meal.type as keyof typeof sampleMeals].map((option) => (
                                <div
                                  key={option.id}
                                  className="border rounded-md overflow-hidden cursor-pointer hover:border-fitnest-green transition-colors"
                                  onClick={() => handleMealSelection(dayIndex, mealIndex, option)}
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
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} className="bg-fitnest-orange hover:bg-fitnest-orange/90">
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
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image src={plan.image || "/placeholder.svg"} alt={plan.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.title}</h3>
                    <p className="text-sm text-gray-500">
                      {mealFrequencies.find((option) => option.id === selectedFrequency)?.label}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Price:</span>
                    <span>{plan.basePrice} MAD / week</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Meals Per Day:</span>
                    <span>
                      {mealFrequencies.find((option) => option.id === selectedFrequency)?.label || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Additional Snacks:</span>
                    <span>{snackOptions.find((option) => option.id === selectedSnacks)?.label || "None"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Subscription Period:</span>
                    <span>
                      {subscriptionPeriods.find((option) => option.id === selectedPeriod)?.label || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Start Date:</span>
                    <span>{startDate ? format(startDate, "MMM d, yyyy") : "Not selected"}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{totalPrice} MAD</span>
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
                {step === 3 ? (
                  <Button onClick={handleNext} className="w-full bg-fitnest-orange hover:bg-fitnest-orange/90">
                    Proceed to Checkout
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      initializeMenuDays()
                      setStep(3) // Skip step 2 and go directly to menu building
                    }}
                    className="w-full"
                    disabled={!startDate}
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
