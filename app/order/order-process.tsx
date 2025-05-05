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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const deliveryOptions = [
  { id: "daily", label: "Daily Delivery", description: "Fresh meals delivered every day", multiplier: 1 },
  { id: "3-days", label: "3 Days Package", description: "Meals for 3 days delivered twice a week", multiplier: 0.95 },
  { id: "weekly", label: "Weekly Package", description: "All meals for the week delivered at once", multiplier: 0.9 },
]

const mealFrequencies = [
  { id: "2-meals", label: "2 Meals / Day", description: "Lunch and Dinner", multiplier: 1 },
  { id: "3-meals", label: "3 Meals / Day", description: "Breakfast, Lunch, and Dinner", multiplier: 1.4 },
  { id: "4-meals", label: "4 Meals / Day", description: "Breakfast, Lunch, Dinner, and Snack", multiplier: 1.7 },
]

const subscriptionPeriods = [
  { id: "1-week", label: "1 Week", description: "Try it out", multiplier: 1 },
  { id: "2-weeks", label: "2 Weeks", description: "Short commitment", multiplier: 0.97 },
  { id: "4-weeks", label: "4 Weeks", description: "Most popular", multiplier: 0.95, popular: true },
  { id: "12-weeks", label: "12 Weeks", description: "Best value", multiplier: 0.9 },
]

export function OrderProcess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan") || "weight-loss"
  const plan = mealPlans[planId as keyof typeof mealPlans] || mealPlans["weight-loss"]

  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[1].id)
  const [selectedFrequency, setSelectedFrequency] = useState(mealFrequencies[0].id)
  const [selectedPeriod, setSelectedPeriod] = useState(subscriptionPeriods[2].id)
  const [startDate, setStartDate] = useState<Date | undefined>(addDays(new Date(), 2))
  const [step, setStep] = useState(1)

  // Calculate price
  const calculatePrice = () => {
    const basePrice = plan.basePrice
    const deliveryMultiplier = deliveryOptions.find((option) => option.id === selectedDelivery)?.multiplier || 1
    const frequencyMultiplier = mealFrequencies.find((option) => option.id === selectedFrequency)?.multiplier || 1
    const periodMultiplier = subscriptionPeriods.find((option) => option.id === selectedPeriod)?.multiplier || 1

    return Math.round(basePrice * deliveryMultiplier * frequencyMultiplier * periodMultiplier)
  }

  const totalPrice = calculatePrice()

  const handleNext = () => {
    if (step < 3) {
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
                <CardTitle>Choose Your Delivery Options</CardTitle>
                <CardDescription>Select how often you want your meals delivered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Delivery Frequency</Label>
                  <RadioGroup
                    value={selectedDelivery}
                    onValueChange={setSelectedDelivery}
                    className="grid gap-4 md:grid-cols-3"
                  >
                    {deliveryOptions.map((option) => (
                      <div key={option.id}>
                        <RadioGroupItem value={option.id} id={`delivery-${option.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`delivery-${option.id}`}
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
                <Button onClick={handleNext} disabled={!startDate}>
                  Continue
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences</CardTitle>
                <CardDescription>Customize your meals to fit your dietary needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Dietary Restrictions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free", "No Restrictions"].map(
                      (option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`diet-${option}`}
                            className="rounded border-gray-300 text-fitnest-green focus:ring-fitnest-green"
                          />
                          <Label htmlFor={`diet-${option}`} className="text-sm font-normal">
                            {option}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Allergies</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Eggs", "Fish", "Shellfish", "Soy", "Wheat", "None"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`allergy-${option}`}
                          className="rounded border-gray-300 text-fitnest-green focus:ring-fitnest-green"
                        />
                        <Label htmlFor={`allergy-${option}`} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Calorie Target</Label>
                  <div className="flex flex-col space-y-2">
                    <Select defaultValue="default">
                      <SelectTrigger className="w-full md:w-[280px]">
                        <SelectValue placeholder="Select calorie target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default for {plan.title}</SelectItem>
                        <SelectItem value="low">Low Calorie (1200-1500)</SelectItem>
                        <SelectItem value="medium">Medium Calorie (1500-1800)</SelectItem>
                        <SelectItem value="high">High Calorie (1800-2200)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Additional Notes</Label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-fitnest-green"
                    placeholder="Any specific preferences or instructions for our chefs..."
                  ></textarea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext}>Continue</Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
                <CardDescription>Please review your order details before proceeding to checkout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md">
                    <Image src={plan.image || "/placeholder.svg"} alt={plan.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.title}</h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Option:</span>
                    <span className="font-medium">
                      {deliveryOptions.find((option) => option.id === selectedDelivery)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meals Per Day:</span>
                    <span className="font-medium">
                      {mealFrequencies.find((option) => option.id === selectedFrequency)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subscription Period:</span>
                    <span className="font-medium">
                      {subscriptionPeriods.find((option) => option.id === selectedPeriod)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{startDate ? format(startDate, "PPP") : "Not selected"}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Price:</span>
                    <span>{totalPrice} MAD / week</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Your subscription will automatically renew at the end of your selected period. You can cancel or
                    pause anytime.
                  </p>
                </div>
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
                    <span>Delivery Option:</span>
                    <span>
                      {deliveryOptions.find((option) => option.id === selectedDelivery)?.label || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Subscription Period:</span>
                    <span>
                      {subscriptionPeriods.find((option) => option.id === selectedPeriod)?.label || "Not selected"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{totalPrice} MAD / week</span>
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
                <Button
                  onClick={handleNext}
                  className="w-full bg-fitnest-orange hover:bg-fitnest-orange/90"
                  disabled={step === 3}
                >
                  {step === 3 ? "Proceed to Checkout" : "Continue"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
