"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  productId: number
  quantity: number
  name: string
  price: number
  salePrice?: number
  imageUrl?: string
}

interface CartData {
  items: CartItem[]
  subtotal: number
  cartId: string
}

interface MealPlanData {
  planId: string
  planName: string
  planPrice: number
  duration: string
  mealsPerWeek: number
  customizations?: {
    dietaryRestrictions?: string[]
    allergies?: string[]
    preferences?: string[]
  }
  deliverySchedule?: {
    frequency: string
    preferredDay: string
    startDate: string
  }
}

export function CheckoutContent() {
  const [cart, setCart] = useState<CartData | null>(null)
  const [mealPlan, setMealPlan] = useState<MealPlanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    deliveryOption: "standard",
  })

  useEffect(() => {
    fetchCart()
    loadMealPlanData()
  }, [])

  const loadMealPlanData = () => {
    try {
      // Load meal plan data from localStorage
      const savedMealPlan = localStorage.getItem("selectedMealPlan")
      const savedCustomizations = localStorage.getItem("mealPlanCustomizations")
      const savedDeliverySchedule = localStorage.getItem("mealPlanDelivery")

      if (savedMealPlan) {
        const planData = JSON.parse(savedMealPlan)
        const customizations = savedCustomizations ? JSON.parse(savedCustomizations) : undefined
        const deliverySchedule = savedDeliverySchedule ? JSON.parse(savedDeliverySchedule) : undefined

        const mealPlanData: MealPlanData = {
          planId: planData.id || planData.planId,
          planName: planData.name || planData.planName,
          planPrice: planData.price || planData.planPrice || 0,
          duration: planData.duration || "4 weeks",
          mealsPerWeek: planData.mealsPerWeek || 7,
          customizations,
          deliverySchedule,
        }

        setMealPlan(mealPlanData)
        console.log("Loaded meal plan data:", mealPlanData)
      }
    } catch (error) {
      console.error("Error loading meal plan data:", error)
      // Don't set error state, just continue without meal plan
    }
  }

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/cart")

      if (!response.ok) {
        throw new Error(`Failed to load cart: ${response.status}`)
      }

      const data = await response.json()
      console.log("Cart data:", data)
      setCart(data)
    } catch (error) {
      console.error("Error fetching cart:", error)
      setError("Failed to load cart data")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cart || (cart.items.length === 0 && !mealPlan)) {
      setError("Your cart is empty and no meal plan selected")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes,
          deliveryOption: formData.deliveryOption,
        },
        order: {
          cartItems:
            cart?.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.salePrice || item.price,
            })) || [],
          cartSubtotal: cart?.subtotal || 0,
          shipping: formData.deliveryOption === "express" ? 30 : 0,
          mealPlan: mealPlan, // Include meal plan data
        },
      }

      console.log("Sending order data:", orderData)

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Order creation failed:", errorData)
        throw new Error(errorData.error || "Failed to create order")
      }

      const result = await response.json()
      console.log("Order created successfully:", result)

      // Clear the cart after successful order
      try {
        await fetch("/api/cart/clear", { method: "POST" })
        console.log("Cart cleared successfully")

        // Clear meal plan data from localStorage
        if (mealPlan) {
          localStorage.removeItem("selectedMealPlan")
          localStorage.removeItem("mealPlanCustomizations")
          localStorage.removeItem("mealPlanDelivery")
          console.log("Meal plan data cleared from localStorage")
        }

        // Dispatch cart update event to update the header icon
        window.dispatchEvent(new CustomEvent("cartUpdated"))
      } catch (clearError) {
        console.error("Error clearing cart:", clearError)
        // Don't fail the order if cart clearing fails
      }

      // Redirect to confirmation
      router.push(`/checkout/confirmation?orderId=${result.orderId}`)
    } catch (error) {
      console.error("Error submitting order:", error)
      setError(error instanceof Error ? error.message : "Failed to create order")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
        <div className="flex h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error && !cart && !mealPlan) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchCart} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!cart && !mealPlan) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
        <Card>
          <CardContent className="p-6">
            <p>Your cart is empty and no meal plan selected.</p>
            <div className="mt-4 space-x-4">
              <Button onClick={() => router.push("/express-shop")}>Shop Products</Button>
              <Button onClick={() => router.push("/meal-plans")} variant="outline">
                Browse Meal Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const cartSubtotal = cart?.subtotal || 0
  const mealPlanPrice = mealPlan?.planPrice || 0
  const shippingCost = formData.deliveryOption === "express" ? 30 : 0
  const total = cartSubtotal + mealPlanPrice + shippingCost

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                    First Name *
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                    Last Name *
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone *
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., 0612345678"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Address *
                </label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full delivery address"
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">
                    City *
                  </label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                    Postal Code *
                  </label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                  Delivery Notes (Optional)
                </label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special delivery instructions"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Delivery Option</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="standard"
                      checked={formData.deliveryOption === "standard"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Standard Delivery (Free) - 2-3 business days
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="express"
                      checked={formData.deliveryOption === "express"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Express Delivery (+30 MAD) - Same day
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Processing..." : `Place Order (${total.toFixed(2)} MAD)`}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Meal Plan Section */}
              {mealPlan && (
                <>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Meal Plan Subscription</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{mealPlan.planName}</p>
                          <p className="text-sm text-gray-600">
                            {mealPlan.duration} • {mealPlan.mealsPerWeek} meals/week
                          </p>
                          {mealPlan.customizations && (
                            <div className="text-xs text-gray-500 mt-1">
                              {mealPlan.customizations.dietaryRestrictions &&
                                `Diet: ${mealPlan.customizations.dietaryRestrictions.join(", ")}`}
                            </div>
                          )}
                        </div>
                        <p className="font-medium text-green-700">{mealPlan.planPrice.toFixed(2)} MAD</p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Cart Items Section */}
              {cart && cart.items.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Express Shop Items</h3>
                    {cart.items.map((item) => (
                      <div key={`${item.productId}-${item.id}`} className="flex justify-between mb-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{((item.salePrice || item.price) * item.quantity).toFixed(2)} MAD</p>
                      </div>
                    ))}
                  </div>
                  <Separator />
                </>
              )}

              {/* Totals Section */}
              {cart && cart.items.length > 0 && (
                <div className="flex justify-between">
                  <p>Express Shop Subtotal</p>
                  <p>{cartSubtotal.toFixed(2)} MAD</p>
                </div>
              )}

              {mealPlan && (
                <div className="flex justify-between">
                  <p>Meal Plan Subscription</p>
                  <p>{mealPlanPrice.toFixed(2)} MAD</p>
                </div>
              )}

              <div className="flex justify-between">
                <p>Shipping</p>
                <p>{shippingCost === 0 ? "Free" : `${shippingCost.toFixed(2)} MAD`}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>{total.toFixed(2)} MAD</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
