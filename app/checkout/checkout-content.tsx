"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AlertCircle, CheckCircle, ShoppingCart, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

// Types for meal plan selections
interface MealPlanSelections {
  mealType: string
  mealsPerDay: string[]
  daysPerWeek: string[]
  paymentCycle: string
  totalPrice: number
}

// Types for cart items
interface CartItem {
  id: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    description: string
    price: number
    salePrice?: number
    imageUrl?: string
    category: string
  }
}

export function CheckoutContent() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<any>(null)
  const [existingAccountError, setExistingAccountError] = useState<{ email: string } | null>(null)

  // State for cart and meal plan data
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartSubtotal, setCartSubtotal] = useState(0)
  const [mealPlanSelections, setMealPlanSelections] = useState<MealPlanSelections | null>(null)

  // Form state
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
    acceptTerms: false,
  })

  // Form validation
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    terms: "",
  })

  // Load cart data and meal plan selections
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(null)
      setApiError(null)
      setExistingAccountError(null)

      try {
        // Load cart data
        try {
          const cartResponse = await fetch("/api/cart")

          if (!cartResponse.ok) {
            const errorText = await cartResponse.text()
            console.error("Cart API error:", errorText)
            throw new Error(`Failed to load cart data: ${cartResponse.status} ${cartResponse.statusText}`)
          }

          const cartData = await cartResponse.json()
          setCartItems(cartData.items || [])
          setCartSubtotal(cartData.subtotal || 0)
        } catch (cartError) {
          console.error("Error fetching cart:", cartError)
          setApiError({
            type: "cart",
            message: cartError instanceof Error ? cartError.message : "Failed to load cart data",
            details: cartError,
          })
          // Continue loading the page even if cart fails
          setCartItems([])
          setCartSubtotal(0)
        }

        // Load meal plan selections from localStorage if they exist
        if (typeof window !== "undefined") {
          try {
            const storedSelections = localStorage.getItem("mealPlanSelections")
            if (storedSelections) {
              setMealPlanSelections(JSON.parse(storedSelections))
            }
          } catch (storageError) {
            console.error("Error parsing meal plan selections:", storageError)
            // Non-critical error, continue
          }
        }

        // Pre-fill form with user data if available
        if (session?.user) {
          setFormData((prev) => ({
            ...prev,
            firstName: session.user.name?.split(" ")[0] || "",
            lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
            email: session.user.email || "",
          }))
        }
      } catch (error) {
        console.error("Error loading checkout data:", error)
        setError("Failed to load checkout data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router, session, status])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear validation error when field is edited
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Clear existing account error if email is changed
    if (name === "email" && existingAccountError) {
      setExistingAccountError(null)
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }))

    if (formErrors.terms) {
      setFormErrors((prev) => ({ ...prev, terms: "" }))
    }
  }

  // Handle radio button changes
  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, deliveryOption: value }))
  }

  // Validate form
  const validateForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      terms: "",
    }

    let isValid = true

    // Required fields validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
      isValid = false
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
      isValid = false
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
      isValid = false
    } else if (!/^(\+212|0)[5-7]\d{8}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid Moroccan phone number"
      isValid = false
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required"
      isValid = false
    }

    if (!formData.city.trim()) {
      errors.city = "City is required"
      isValid = false
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = "Postal code is required"
      isValid = false
    }

    if (!formData.acceptTerms) {
      errors.terms = "You must accept the terms and conditions"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  // Handle login redirect
  const handleLoginRedirect = () => {
    // Save current cart and form data to session storage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("checkoutFormData", JSON.stringify(formData))
      sessionStorage.setItem("checkoutRedirect", "true")
    }

    // Redirect to login page with return URL
    router.push(`/login?redirect=${encodeURIComponent("/checkout")}`)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to the first error
      const firstError = Object.entries(formErrors).find(([_, value]) => value !== "")
      if (firstError) {
        const element = document.getElementById(firstError[0])
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
      return
    }

    setIsSubmitting(true)
    setError(null)
    setExistingAccountError(null)

    try {
      // Check if we have items to checkout
      if (cartItems.length === 0 && !mealPlanSelections) {
        throw new Error("Your cart is empty. Please add items before checkout.")
      }

      // Prepare order data
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
          cartItems: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.salePrice || item.product.price,
          })),
          mealPlan: mealPlanSelections,
          cartSubtotal,
          mealPlanTotal: mealPlanSelections?.totalPrice || 0,
          shipping: formData.deliveryOption === "express" ? 30 : 0,
        },
      }

      // Submit order
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!response.ok) {
        // Check for existing account error
        if (response.status === 409 && result.error === "Account already exists") {
          setExistingAccountError({ email: result.existingEmail })
          // Scroll to error message
          const errorElement = document.getElementById("existing-account-error")
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
          }
          return
        }

        throw new Error(result.error || "Failed to create order")
      }

      // Store order confirmation data for the confirmation page
      localStorage.setItem(
        "orderConfirmation",
        JSON.stringify({
          orderId: result.orderId,
          orderData,
          isNewAccount: result.isNewAccount,
          timestamp: new Date().toISOString(),
        }),
      )

      // Clear cart and meal plan selections
      if (mealPlanSelections) {
        localStorage.removeItem("mealPlanSelections")
      }

      // Navigate to confirmation page
      router.push("/checkout/confirmation")
    } catch (error) {
      console.error("Error submitting order:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.")

      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      })

      // Scroll to error message
      const errorElement = document.getElementById("checkout-error")
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  // Format meal type for display
  const formatMealType = (type: string) => {
    return type?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Calculate totals
  const mealPlanTotal = mealPlanSelections?.totalPrice || 0
  const expressTotal = cartSubtotal
  const subtotal = mealPlanTotal + expressTotal
  const shipping = formData.deliveryOption === "express" ? 30 : 0
  const total = subtotal + shipping

  // Determine if we have a mixed cart (both meal plans and express items)
  const hasMealPlan = !!mealPlanSelections
  const hasExpressItems = cartItems.length > 0
  const hasMixedCart = hasMealPlan && hasExpressItems

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your checkout information...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show empty cart message if no items
  if (!hasMealPlan && !hasExpressItems) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-gray-50 p-12 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400" />
          <h2 className="text-xl font-medium">Your cart is empty</h2>
          <p className="text-gray-600">You need to add items to your cart before checkout.</p>
          <div className="mt-4 space-x-4">
            <Link href="/express-shop" className="rounded bg-[#2B7A0B] px-4 py-2 text-white hover:bg-[#236209]">
              Browse Express Shop
            </Link>
            <Link href="/meal-plans" className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
              View Meal Plans
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Checkout</h1>
      <p className="mb-8 text-gray-600">Complete your order to start enjoying healthy, delicious meals</p>

      {error && (
        <Alert variant="destructive" className="mb-6" id="checkout-error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {existingAccountError && (
        <Alert className="mb-6 border-amber-500 bg-amber-50" id="existing-account-error">
          <Info className="h-4 w-4 text-amber-600" />
          <div className="ml-2">
            <AlertTitle className="text-amber-800">Account Already Exists</AlertTitle>
            <AlertDescription className="text-amber-700">
              An account with the email <strong>{existingAccountError.email}</strong> already exists. Please{" "}
              <button
                onClick={handleLoginRedirect}
                className="font-medium text-[#2B7A0B] underline hover:text-[#236209]"
              >
                log in
              </button>{" "}
              to continue with your purchase.
            </AlertDescription>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName" className="mb-1 block text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={formErrors.firstName ? "border-red-500" : ""}
                      placeholder="Enter your first name"
                    />
                    {formErrors.firstName && <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="mb-1 block text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={formErrors.lastName ? "border-red-500" : ""}
                      placeholder="Enter your last name"
                    />
                    {formErrors.lastName && <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email" className="mb-1 block text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={formErrors.email || existingAccountError ? "border-red-500" : ""}
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="mb-1 block text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={formErrors.phone ? "border-red-500" : ""}
                      placeholder="Enter your phone number (e.g., 0612345678)"
                    />
                    {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="mb-1 block text-sm font-medium">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={formErrors.address ? "border-red-500" : ""}
                      placeholder="Enter your full delivery address"
                      rows={3}
                    />
                    {formErrors.address && <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="city" className="mb-1 block text-sm font-medium">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={formErrors.city ? "border-red-500" : ""}
                        placeholder="Enter your city"
                      />
                      {formErrors.city && <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="mb-1 block text-sm font-medium">
                        Postal Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={formErrors.postalCode ? "border-red-500" : ""}
                        placeholder="Enter your postal code"
                      />
                      {formErrors.postalCode && <p className="mt-1 text-sm text-red-500">{formErrors.postalCode}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="mb-1 block text-sm font-medium">
                      Delivery Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for delivery (e.g., building access, landmarks)"
                      rows={2}
                    />
                  </div>

                  {/* Delivery Options */}
                  <div className="mt-4">
                    <Label className="mb-3 block text-sm font-medium">Delivery Options</Label>
                    <RadioGroup value={formData.deliveryOption} onValueChange={handleRadioChange}>
                      <div className="mb-3 flex items-start space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="standard" className="font-medium">
                            Standard Delivery (Free)
                          </Label>
                          <p className="text-sm text-gray-500">
                            {hasMealPlan
                              ? "Meal plans delivered according to your subscription schedule"
                              : "Delivered within 2-3 business days"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="express" className="font-medium">
                            Express Delivery (+30 MAD)
                          </Label>
                          <p className="text-sm text-gray-500">
                            {hasMixedCart
                              ? "Express items delivered same day, meal plans follow subscription schedule"
                              : "Same day delivery for orders placed before 2PM"}
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
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
                  <div className="flex items-center space-x-3 rounded-md border border-green-200 bg-green-50 p-4">
                    <CheckCircle className="h-5 w-5 text-[#2B7A0B]" />
                    <div>
                      <Label htmlFor="cash" className="font-medium">
                        Cash on Delivery
                      </Label>
                      <p className="text-sm text-gray-600">Pay in cash when your meals are delivered</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    More payment methods coming soon (Credit Card, Mobile Payment)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2 py-4">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={handleCheckboxChange}
                className={formErrors.terms ? "border-red-500" : ""}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className={`text-sm font-medium leading-none ${formErrors.terms ? "text-red-500" : ""}`}
                >
                  I accept the terms and conditions
                </Label>
                <p className="text-sm text-gray-500">
                  By placing this order, you agree to our{" "}
                  <Link href="/terms" className="text-[#2B7A0B] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#2B7A0B] hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
                {formErrors.terms && <p className="text-sm text-red-500">{formErrors.terms}</p>}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Express Shop Items */}
                  {hasExpressItems && (
                    <div>
                      <h3 className="mb-2 font-medium">Express Shop Items</h3>
                      <ul className="mb-3 space-y-2">
                        {cartItems.map((item) => (
                          <li key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.product.name} x{item.quantity}
                            </span>
                            <span>{formatPrice((item.product.salePrice || item.product.price) * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Express Subtotal:</span>
                        <span>{formatPrice(expressTotal)}</span>
                      </div>
                    </div>
                  )}

                  {/* Meal Plan */}
                  {hasMealPlan && (
                    <div className={hasExpressItems ? "border-t pt-3" : ""}>
                      <h3 className="mb-2 font-medium">Meal Plan Subscription</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Meal type:</span>
                          <span className="capitalize">{formatMealType(mealPlanSelections.mealType)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Meals per day:</span>
                          <span>{mealPlanSelections.mealsPerDay.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Days per week:</span>
                          <span>{mealPlanSelections.daysPerWeek.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment cycle:</span>
                          <span className="capitalize">{mealPlanSelections.paymentCycle}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Meal Plan Subtotal:</span>
                          <span>{formatPrice(mealPlanTotal)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Totals */}
                  <div className="pt-2">
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                      <span>Total:</span>
                      <span>
                        {formatPrice(total)}
                        {hasMealPlan && (
                          <span className="block text-sm font-normal text-gray-500">
                            /{mealPlanSelections.paymentCycle === "weekly" ? "week" : "month"}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !!existingAccountError}
                    className="mt-4 w-full bg-[#2B7A0B] py-3 font-medium text-white hover:bg-[#236209]"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" /> Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>

                  <div className="mt-2 text-center text-sm text-gray-500">
                    {hasMealPlan && "You can modify or cancel your subscription anytime"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
