"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { Mail, User, MapPin, Target, Bell } from "lucide-react"

export default function WaitlistPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    fitnessGoal: "",
    preferredMealPlan: "",
    wantsNotifications: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          fitness_goal: formData.fitnessGoal,
          preferred_meal_plan: formData.preferredMealPlan,
          wants_notifications: formData.wantsNotifications,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage("Successfully joined the waitlist! We'll notify you when we launch.")
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          router.push("/waitlist/success")
        }, 2000)
      } else {
        setMessage(data.error || "Failed to join waitlist. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting waitlist:", error)
      setMessage("Failed to join waitlist. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Waitlist</h1>
          <p className="text-xl text-gray-600">
            Be the first to know when Fitnest launches in Morocco! Get exclusive early access and special offers.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Reserve Your Spot
            </CardTitle>
            <CardDescription>
              Fill out the form below to join our exclusive waitlist and be notified when we launch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    City
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Casablanca, Rabat, etc."
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    Fitness Goal
                  </Label>
                  <Select
                    value={formData.fitnessGoal}
                    onValueChange={(value) => handleInputChange("fitnessGoal", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary fitness goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                      <SelectItem value="athletic-performance">Athletic Performance</SelectItem>
                      <SelectItem value="general-health">General Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Meal Plan</Label>
                  <Select
                    value={formData.preferredMealPlan}
                    onValueChange={(value) => handleInputChange("preferredMealPlan", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred meal plan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="high-protein">High Protein</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="not-sure">Not Sure Yet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notifications */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={formData.wantsNotifications}
                  onCheckedChange={(checked) => handleInputChange("wantsNotifications", checked as boolean)}
                />
                <Label htmlFor="notifications" className="flex items-center text-sm">
                  <Bell className="h-4 w-4 mr-1" />I want to receive updates about Fitnest launch and special offers
                </Label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Joining Waitlist..." : "Join Waitlist"}
              </Button>

              {/* Message */}
              {message && (
                <div
                  className={`text-center p-3 rounded-md ${
                    message.includes("Successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            By joining our waitlist, you'll get exclusive early access, special launch discounts, and be the first to
            experience Morocco's premier meal delivery service.
          </p>
        </div>
      </div>
    </div>
  )
}
