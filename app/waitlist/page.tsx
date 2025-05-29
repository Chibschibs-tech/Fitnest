"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, Star, ArrowRight } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Add this at the top of the component function, after the existing imports
export default function WaitlistPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      mealPlan: formData.get("mealPlan"),
      city: formData.get("city"),
      notifications: formData.get("notifications") === "on",
    }

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitMessage(
          `🎉 Success! You're #${result.position} on the waitlist. Estimated wait: ${result.estimatedWait} weeks.`,
        )
        // Reset form
        e.currentTarget.reset()
      } else {
        setSubmitMessage(`❌ ${result.error}`)
      }
    } catch (error) {
      setSubmitMessage("❌ Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-fitnest-green to-fitnest-green/80 py-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-fitnest-orange text-white px-4 py-2 text-sm font-semibold">
              🔥 High Demand Alert
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              We're Temporarily
              <span className="block text-fitnest-orange">Pausing New Orders</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              The response to Fitnest.ma has been incredible! To maintain the exceptional quality and personalized
              service our customers love, we're carefully managing our capacity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-white/90">
                <Users className="h-5 w-5" />
                <span className="font-medium">2,847 people already joined</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Average wait: 2-3 weeks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-fitnest-orange/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </section>

      {/* Why We Paused Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Quality Over Quantity, Always
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-fitnest-green/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-fitnest-green" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Personalized Attention</h3>
                      <p className="text-gray-600">
                        Every meal plan is carefully crafted by our nutritionists to meet your specific goals and
                        dietary needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-fitnest-orange/10 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-fitnest-orange" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Premium Ingredients</h3>
                      <p className="text-gray-600">
                        We source only the finest, freshest ingredients and refuse to compromise on quality for
                        quantity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-fitnest-green/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-fitnest-green" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Timely Delivery</h3>
                      <p className="text-gray-600">
                        Your meals arrive fresh and on time, every time. We'd rather pause than disappoint.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Image
                  src="/professional-chef-portrait.png"
                  alt="Professional Chef"
                  width={500}
                  height={600}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-fitnest-orange text-fitnest-orange" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">4.9/5 Rating</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">From 1,200+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Join the Exclusive Waitlist</h2>
              <p className="text-lg text-gray-600">
                Be the first to know when we're accepting new customers again. Plus, get exclusive perks for your
                patience!
              </p>
            </div>

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="w-full"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className="w-full"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="w-full"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="mealPlan" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Meal Plan
                    </label>
                    <select
                      id="mealPlan"
                      name="mealPlan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fitnest-green focus:border-fitnest-green"
                    >
                      <option value="">Select a meal plan</option>
                      <option value="weight-loss">Weight Loss Plan</option>
                      <option value="balanced-nutrition">Stay Fit Plan</option>
                      <option value="muscle-gain">Muscle Gain Plan</option>
                      <option value="keto">Keto Plan</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fitnest-green focus:border-fitnest-green"
                    >
                      <option value="">Select your city</option>
                      <option value="casablanca">Casablanca</option>
                      <option value="rabat">Rabat</option>
                      <option value="marrakech">Marrakech</option>
                      <option value="fes">Fès</option>
                      <option value="tangier">Tangier</option>
                      <option value="agadir">Agadir</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      className="mt-1 h-4 w-4 text-fitnest-green focus:ring-fitnest-green border-gray-300 rounded"
                    />
                    <label htmlFor="notifications" className="text-sm text-gray-600">
                      I'd like to receive updates about new meal options, nutrition tips, and exclusive offers via email
                      and SMS.
                    </label>
                  </div>

                  {submitMessage && (
                    <div
                      className={`p-4 rounded-lg ${submitMessage.includes("Success") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                    >
                      {submitMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white py-3 text-lg font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? "Joining Waitlist..." : "Join the Waitlist"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-fitnest-orange/10 rounded-lg">
                  <h4 className="font-semibold text-fitnest-orange mb-2">🎁 Waitlist Exclusive Benefits:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 15% discount on your first month</li>
                    <li>• Priority access to new meal options</li>
                    <li>• Free nutrition consultation</li>
                    <li>• Complimentary delivery for your first order</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Current Customers Say</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-fitnest-orange text-fitnest-orange" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "The quality is unmatched. Every meal feels like it was prepared just for me. Worth every dirham and
                  every day of waiting!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    <Image src="/diverse-group-city.png" alt="Customer" width={40} height={40} />
                  </div>
                  <div>
                    <p className="font-semibold">Amina K.</p>
                    <p className="text-sm text-gray-600">Casablanca</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-fitnest-orange text-fitnest-orange" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "I understand why they paused. The attention to detail and personalized service is incredible. Can't
                  wait for others to experience this!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    <Image src="/contemplative-man.png" alt="Customer" width={40} height={40} />
                  </div>
                  <div>
                    <p className="font-semibold">Youssef M.</p>
                    <p className="text-sm text-gray-600">Rabat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-fitnest-orange text-fitnest-orange" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Quality over quantity - that's exactly why I chose Fitnest.ma. The wait was absolutely worth it for
                  this level of service."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    <Image src="/contemplative-artist.png" alt="Customer" width={40} height={40} />
                  </div>
                  <div>
                    <p className="font-semibold">Fatima L.</p>
                    <p className="text-sm text-gray-600">Marrakech</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">How long is the current wait time?</h3>
                  <p className="text-gray-600">
                    Current average wait time is 2-3 weeks. We'll notify you as soon as a spot opens up, and you'll have
                    48 hours to confirm your subscription.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Will I lose my spot if I don't respond immediately?</h3>
                  <p className="text-gray-600">
                    You'll have 48 hours to respond when we contact you. If you miss this window, you'll be moved to the
                    end of the waitlist, but you won't lose your place permanently.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Are the waitlist benefits guaranteed?</h3>
                  <p className="text-gray-600">
                    Yes! Everyone on our waitlist will receive the 15% first-month discount, free nutrition
                    consultation, and complimentary first delivery when they join.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Can I change my meal plan preference later?</h3>
                  <p className="text-gray-600">
                    Your meal plan preference helps us prepare, but you can change it when you're contacted or even
                    after you start your subscription.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-fitnest-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Healthy Lifestyle Journey Awaits</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Join thousands of satisfied customers who chose quality over convenience. Your spot is reserved - we just
            need your details.
          </p>
          <Button className="bg-fitnest-orange hover:bg-fitnest-orange/90 text-white px-8 py-3 text-lg font-semibold">
            Secure Your Spot Now
          </Button>
        </div>
      </section>
    </div>
  )
}
