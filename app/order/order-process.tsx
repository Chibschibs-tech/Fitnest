"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { format, addDays, isBefore, isAfter, startOfWeek, startOfDay } from "date-fns"
import { ChevronLeft, Info, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { DeliveryCalendar } from "@/components/delivery-calendar"

// Define meal plan data
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

const allergies = [
  { id: "dairy", label: "Dairy", description: "Milk, cheese, yogurt" },
  { id: "gluten", label: "Gluten", description: "Wheat, barley, rye" },
  { id: "nuts", label: "Nuts", description: "Peanuts, tree nuts" },
  { id: "shellfish", label: "Shellfish", description: "Shrimp, crab, lobster" },
  { id: "eggs", label: "Eggs", description: "Chicken eggs" },
  { id: "soy", label: "Soy", description: "Soybeans and products" },
]

const durationOptions = [
  { value: 1, label: "1 Week" },
  { value: 2, label: "2 Weeks" },
  { value: 4, label: "1 Month" },
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
    { id: "s1", name: "Greek Yogurt with Berries", image: "/placeholder.svg?height=160&width=160", calories: 150 },
    { id: "s2", name: "Protein Energy Bites", image: "/placeholder.svg?height=160&width=160", calories: 120 },
    { id: "s3", name: "Mixed Nuts and Dried Fruits", image: "/placeholder.svg?height=160&width=160", calories: 180 },
    { id: "s4", name: "Vegetable Sticks with Hummus", image: "/placeholder.svg?height=160&width=160", calories: 130 },
  ],
}

export function OrderProcess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planIdFromUrl = searchParams.get("plan")

  const mappedPlanId = planIdFromUrl === "balanced-nutrition" ? "stay-fit" : planIdFromUrl

  const [selectedPlanId, setSelectedPlanId] = useState<string>(mappedPlanId || "")
  const selectedPlan = selectedPlanId ? mealPlans[selectedPlanId as keyof typeof mealPlans] : null

  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>(["lunch", "dinner"])
  const [selectedSnacks, setSelectedSnacks] = useState("0-snacks")
  const [duration, setDuration] = useState(1) // Default to 1 week
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [selectedDays, setSelectedDays] = useState<Date[]>([])

  const [step, setStep] = useState(1)
  const [menuSelections, setMenuSelections] = useState<Record<string, Record<string, any>>>({})
  const [errors, setErrors] = useState<{
    mealPlan?: string
    mealTypes?: string
    days?: string
    menu?: string
  }>({})

  // Calendar rules
  const today = new Date()
  const weekStartsOn = 1 as const // Monday
  const allowedWeeks = duration === 1 ? 2 : duration === 2 ? 3 : 4
  const allowedStart = startOfWeek(today, { weekStartsOn })
  const allowedEnd = addDays(allowedStart, allowedWeeks * 7 - 1)
  const todayStart = startOfDay(today)

  const sortedSelectedDays = [...selectedDays].sort((a, b) => a.getTime() - b.getTime())
  const startDate = sortedSelectedDays.length > 0 ? sortedSelectedDays[0] : undefined

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

  // Calculate base price per day
  const calculateDailyPrice = () => {
    if (!selectedPlan) return 0
    const basePrice = selectedPlan.basePrice / 7
    let mealTypeMultiplier = 0
    if (selectedMealTypes.includes("breakfast")) mealTypeMultiplier += 0.3
    if (selectedMealTypes.includes("lunch")) mealTypeMultiplier += 0.35
    if (selectedMealTypes.includes("dinner")) mealTypeMultiplier += 0.35
    const snackMultiplier = snackOptions.find((option) => option.id === selectedSnacks)?.multiplier || 0
    return Math.round(basePrice * (mealTypeMultiplier + snackMultiplier) * 10) / 10
  }

  // Calculate total price based on number of selected days
  const calculateTotalPrice = () => {
    const dailyPrice = calculateDailyPrice()
    return Math.round(dailyPrice * selectedDays.length)
  }

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
      if (selectedDays.length < 3) newErrors.days = "Please select at least 3 delivery days"
    } else if (step === 2) {
      if (!isMenuComplete()) newErrors.menu = "Please select all meals for your plan"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      if (step < 2) {
        setStep(step + 1)
        window.scrollTo(0, 0)
      } else {
        const mealPlanData = {
          planId: selectedPlanId,
          planName: selectedPlan?.title,
          planPrice: calculateTotalPrice(),
          duration: `${selectedDays.length} days`,
          mealsPerWeek: null, // Obsolete
          customizations: {
            dietaryRestrictions: selectedAllergies
              .map((id) => allergies.find((a) => a.id === id)?.label)
              .filter(Boolean),
            mealTypes: selectedMealTypes,
            snacks: selectedSnacks,
          },
          deliverySchedule: {
            frequency: "Custom",
            selectedDays: sortedSelectedDays.map((d) => d.toISOString()),
            startDate: startDate?.toISOString(),
          },
        }
        localStorage.setItem("selectedMealPlan", JSON.stringify(mealPlanData))
        router.push("/checkout")
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    } else {
      router.push(selectedPlanId ? `/meal-plans/${selectedPlanId}` : "/meal-plans")
    }
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
                              src={plan.image || "/placeholder.svg?height=64&width=64&query=meal+plan"}
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
                          className="relative flex flex-col items-center justify-center rounded-md border-2 border-muted bg-white p-4 h-full hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-fitnest-green [&:has([data-state=checked])]:border-fitnest-green"
                        >
                          <h3 className="font-semibold">{option.label}</h3>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Calendar Day Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Select your delivery days</Label>
                  <p className="text-sm text-gray-500 mb-4">
                    Click on the dates you'd like to receive your meals. Select at least 3 days.
                  </p>
                  <div className="flex justify-center p-1">
                    <DeliveryCalendar
                      allowedWeeks={allowedWeeks}
                      value={selectedDays}
                      onChange={(days) => setSelectedDays(days)}
                      className="w-full"
                    />
                  </div>
                  {errors.days && <p className="text-red-500 text-sm mt-2">{errors.days}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!selectedPlanId || selectedDays.length < 3}>
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
                          {selectedMealTypes.map((mealType) => (
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
                                        {menuSelections[day.toISOString()][mealType].calories} calories
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
                                          src={
                                            option.image || "/placeholder.svg?height=128&width=192&query=meal+option"
                                          }
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
                          {/* Render snack selectors */}
                          {Array.from({
                            length: selectedSnacks === "1-snack" ? 1 : selectedSnacks === "2-snacks" ? 2 : 0,
                          }).map((_, i) => {
                            const snackKey = `snack${i + 1}`
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
                                          {menuSelections[day.toISOString()][snackKey].calories} calories
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
                                    {sampleMeals["snack"].map((option) => (
                                      <div
                                        key={option.id}
                                        className="border rounded-md overflow-hidden cursor-pointer hover:border-fitnest-green transition-colors"
                                        onClick={() => handleMealSelection(day, snackKey, option)}
                                      >
                                        <div className="relative h-32 w-full">
                                          <Image
                                            src={
                                              option.image || "/placeholder.svg?height=128&width=192&query=snack+option"
                                            }
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
                            )
                          })}
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
                        src={selectedPlan.image || "/placeholder.svg?height=64&width=64&query=plan"}
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
                    <span>Total Delivery Days:</span>
                    <span>{selectedDays.length} days</span>
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
                  <Button onClick={handleNext} className="w-full" disabled={!selectedPlanId || selectedDays.length < 3}>
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
