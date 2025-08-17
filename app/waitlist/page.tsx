"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Users, Clock, Zap, Heart, Shield, Award } from "lucide-react"
import Image from "next/image"

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    fitnessGoal: "",
    mealPlanPreference: "",
    notifications: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        console.error("Failed to submit waitlist form")
      }
    } catch (error) {
      console.error("Error submitting waitlist form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to the Family!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for joining our waitlist. You'll be among the first to know when Fitnest launches in Morocco.
            </p>
            <p className="text-sm text-gray-500">We'll send you exclusive updates and early access offers.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Coming Soon to Morocco
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Join Our Waitlist
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Be the first to know when Fitnest launches in Morocco! Get exclusive early access and special offers.
          </p>

          <div className="relative w-full max-w-3xl mx-auto mb-12">
            <Image
              src="/hero-banner-full.png"
              alt="Fitnest Meal Plans"
              width={800}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold mb-2">10,000+</h3>
              <p className="text-gray-600">People Already Joined</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold mb-2">30 Days</h3>
              <p className="text-gray-600">Average Wait Time</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold mb-2">4.9/5</h3>
              <p className="text-gray-600">Early Tester Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Reserve Your Spot
              </CardTitle>
              <CardDescription>
                Fill out the form below to join our exclusive waitlist and be notified when we launch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      First Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your first name"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <Input
                      type="text"
                      placeholder="Enter your last name"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">📧 Email Address *</label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="+212 6XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">📍 City</label>
                    <Input
                      type="text"
                      placeholder="Casablanca, Rabat, etc."
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">🎯 Fitness Goal</label>
                  <Select onValueChange={(value) => setFormData({ ...formData, fitnessGoal: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary fitness goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="athletic-performance">Athletic Performance</SelectItem>
                      <SelectItem value="general-health">General Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Meal Plan</label>
                  <Select onValueChange={(value) => setFormData({ ...formData, mealPlanPreference: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your preferred meal plan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced-nutrition">Balanced Nutrition</SelectItem>
                      <SelectItem value="keto-friendly">Keto Friendly</SelectItem>
                      <SelectItem value="high-protein">High Protein</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="custom">Custom Plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Joining..." : "Join the Waitlist"}
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What You'll Get</h2>
            <p className="text-xl text-gray-600">When Fitnest launches in Morocco</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Nutrition</h3>
                <p className="text-gray-600">
                  Customized meal plans based on your goals, dietary preferences, and lifestyle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
                <p className="text-gray-600">Locally sourced, fresh ingredients delivered right to your doorstep.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Nutritionists</h3>
                <p className="text-gray-600">Meal plans created by certified nutritionists and fitness experts.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Early Testers Say</h2>
            <p className="text-xl text-gray-600">Feedback from our private beta users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Image
                    src="/contemplative-man.png"
                    alt="Ahmed"
                    width={48}
                    height={48}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold">Ahmed K.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Finally, healthy eating made easy in Morocco! The meal plans are delicious and perfectly portioned."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Image
                    src="/contemplative-artist.png"
                    alt="Fatima"
                    width={48}
                    height={48}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold">Fatima L.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I lost 8kg in 3 months! The convenience and quality are unmatched. Can't wait for the official
                  launch."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Image
                    src="/diverse-group-city.png"
                    alt="Youssef"
                    width={48}
                    height={48}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold">Youssef M.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "As a busy professional, Fitnest saved me hours of meal prep while helping me achieve my fitness
                  goals."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about joining our waitlist</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">When will Fitnest launch in Morocco?</h3>
                <p className="text-gray-600">
                  We're targeting early 2024 for our Morocco launch. Waitlist members will get 30-day early access
                  before the general public.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">What cities will you serve first?</h3>
                <p className="text-gray-600">
                  We'll start with Casablanca and Rabat, then expand to Marrakech, Fez, and other major cities based on
                  demand.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Will there be special pricing for waitlist members?</h3>
                <p className="text-gray-600">
                  Waitlist members will receive exclusive launch discounts and special offers not available to the
                  general public.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Can I customize my meal preferences?</h3>
                <p className="text-gray-600">
                  Yes! Our platform will offer extensive customization options for dietary restrictions, allergies, and
                  personal preferences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Don't Miss Out!</h2>
          <p className="text-xl mb-8">Join thousands of health-conscious Moroccans already on our waitlist.</p>
          <Button
            onClick={() => document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg"
          >
            Join the Waitlist Now
          </Button>
        </div>
      </section>
    </div>
  )
}
