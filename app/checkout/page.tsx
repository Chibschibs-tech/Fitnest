"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSafeSession } from "@/hooks/use-safe-session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface MealPlanSelections {
  mealType: string
  mealsPerDay: string[]
  daysPerWeek: string[]
  paymentCycle: string
  totalPrice: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSafeSession()
  const [selections, setSelections] = useState<MealPlanSelections | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      // Redirect to login with callback to checkout
      router.push(`/login?callbackUrl=${encodeURIComponent("/checkout")}`)
      return
    }

    // Get selections from localStorage
    const storedSelections = localStorage.getItem("mealPlanSelections")
    if (!storedSelections) {
      // If no selections, redirect to order page
      router.push("/order")
      return
    }

    try {
      setSelections(JSON.parse(storedSelections))
    } catch (error) {
      console.error("Error parsing meal plan selections:", error)
      router.push("/order")
    }

    setLoading(false)
  }, [router, status])

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!selections) {
    return null // This should not happen due to the redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <p className="p-2 bg-gray-50 rounded border">{session?.user?.name || "Not available"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <p className="p-2 bg-gray-50 rounded border">{session?.user?.email || "Not available"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Enter your full delivery address"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-1">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    className="w-full p-2 border rounded-md"
                    rows={2}
                    placeholder="Any special instructions for delivery"
                  ></textarea>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-md bg-gray-50">
                  <input type="radio" id="cash" name="payment" defaultChecked />
                  <label htmlFor="cash" className="font-medium">
                    Cash on Delivery
                  </label>
                </div>
                <p className="text-sm text-gray-500">More payment methods coming soon (Credit Card, Mobile Payment)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Meal type:</span>
                    <span className="font-medium capitalize">{selections.mealType.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Meals per day:</span>
                    <span className="font-medium">{selections.mealsPerDay.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Days per week:</span>
                    <span className="font-medium">{selections.daysPerWeek.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment cycle:</span>
                    <span className="font-medium capitalize">{selections.paymentCycle}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>
                      {selections.totalPrice} MAD/{selections.paymentCycle === "weekly" ? "week" : "month"}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => router.push("/checkout/confirmation")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium"
                >
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
