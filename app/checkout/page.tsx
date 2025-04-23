"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Truck, Calendar, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type MealPlanSelections = {
  mealType: string
  mealsPerDay: string[]
  daysPerWeek: string[]
  paymentCycle: string
  totalPrice: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [mealPlan, setMealPlan] = useState<MealPlanSelections | null>(null)

  useEffect(() => {
    // Get meal plan selections from localStorage
    const savedSelections = localStorage.getItem("mealPlanSelections")
    if (savedSelections) {
      setMealPlan(JSON.parse(savedSelections))
    } else {
      // Redirect back to meal plans if no selections found
      router.push("/meal-plans")
    }

    // Set default delivery date to next Monday
    const nextMonday = new Date()
    nextMonday.setDate(nextMonday.getDate() + ((8 - nextMonday.getDay()) % 7))
    setDeliveryDate(nextMonday.toISOString().split("T")[0])
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      router.push("/checkout/confirmation")
    }, 1500)
  }

  if (!mealPlan) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we prepare your checkout.</p>
        </div>
      </div>
    )
  }

  const formatMealType = (type: string) => {
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatDays = (days: string[]) => {
    const dayMap: Record<string, string> = {
      sun: "Sunday",
      mon: "Monday",
      tue: "Tuesday",
      wed: "Wednesday",
      thu: "Thursday",
      fri: "Friday",
      sat: "Saturday",
    }

    if (days.length === 7) return "Every day"
    if (
      days.length === 5 &&
      days.includes("mon") &&
      days.includes("tue") &&
      days.includes("wed") &&
      days.includes("thu") &&
      days.includes("fri")
    ) {
      return "Weekdays (Mon-Fri)"
    }

    return days.map((d) => dayMap[d] || d).join(", ")
  }

  const formatMeals = (meals: string[]) => {
    return meals.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-8">
        <Link href="/meal-plans" className="flex items-center text-green-600 hover:text-green-700 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Meal Plan
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Delivery Information
                </CardTitle>
                <CardDescription>Enter your delivery address and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input id="address" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="Casablanca" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" defaultValue="Casablanca-Settat" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal Code</Label>
                    <Input id="zip" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                  <Input id="instructions" placeholder="Apartment number, gate code, etc." />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Delivery Schedule
                </CardTitle>
                <CardDescription>Choose when you want your meals delivered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">First Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">Preferred Delivery Time</Label>
                  <RadioGroup
                    id="deliveryTime"
                    value={deliveryTime}
                    onValueChange={setDeliveryTime}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="morning" id="morning" />
                      <Label htmlFor="morning">Morning (8AM - 12PM)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="afternoon" id="afternoon" />
                      <Label htmlFor="afternoon">Afternoon (12PM - 4PM)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="evening" id="evening" />
                      <Label htmlFor="evening">Evening (4PM - 8PM)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600">
                      Your meals will be delivered fresh on your selected schedule
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600">
                      You'll receive a text message when your delivery is on the way
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    <TabsTrigger value="cash">Cash on Delivery</TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" required={paymentMethod === "card"} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" required={paymentMethod === "card"} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required={paymentMethod === "card"} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" required={paymentMethod === "card"} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="text-center py-8">
                    <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                    <img src="/paypal-logo.png" alt="PayPal" className="h-12 mx-auto" />
                  </TabsContent>

                  <TabsContent value="cash" className="text-center py-8">
                    <p>You will pay in cash when your order is delivered.</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Complete Order"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{formatMealType(mealPlan.mealType)} Plan</span>
                    <span>{mealPlan.totalPrice} MAD</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>
                      {mealPlan.mealsPerDay.length} meals per day ({formatMeals(mealPlan.mealsPerDay)})
                    </div>
                    <div>
                      {mealPlan.daysPerWeek.length} days per week ({formatDays(mealPlan.daysPerWeek)})
                    </div>
                    <div>Billed {mealPlan.paymentCycle}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{mealPlan.totalPrice} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>Free</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{mealPlan.totalPrice} MAD</span>
                </div>

                <div className="pt-4 text-sm text-gray-600">
                  <p>
                    Your subscription will automatically renew each{" "}
                    {mealPlan.paymentCycle === "weekly" ? "week" : "month"}. You can pause or cancel anytime.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
