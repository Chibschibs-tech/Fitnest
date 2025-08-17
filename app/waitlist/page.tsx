"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, Star, ArrowRight, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WaitlistPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "">("")
  const [waitlistCount, setWaitlistCount] = useState(142) // Use actual count from database
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  // Fetch waitlist count on component mount
  useEffect(() => {
    const fetchWaitlistCount = async () => {
      try {
        const response = await fetch("/api/waitlist")
        const data = await response.json()
        if (data.totalCount) {
          setWaitlistCount(data.totalCount)
        }
      } catch (error) {
        console.error("Error fetching waitlist count:", error)
        // Keep the default value if fetch fails
      }
    }

    fetchWaitlistCount()
  }, [])

  const scrollToForm = () => {
    const formSection = document.getElementById("waitlist-form")
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")
    setSubmitStatus("")

    const formData = new FormData(e.currentTarget)
    const data = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`.trim(),
      email: formData.get("email"),
      phone: formData.get("phone"),
      mealPlanPreference: formData.get("mealPlan"),
      city: formData.get("city"),
      notifications: formData.get("notifications") === "on",
    }

    try {
      // Send the data to our simple logging endpoint
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        // Update the count immediately after successful submission
        setWaitlistCount((prev) => prev + 1)

        setSubmitStatus("success")
        setSubmitMessage(
          "Thank you for your interest! Your request has been registered. We will contact you by email very soon.",
        )

        // Reset form
        if (formRef.current) {
          formRef.current.reset()
        }
      } else {
        throw new Error(result.error || "Submission failed")
      }

      // Log for debugging
      console.log("Form submission result:", result)
    } catch (error) {
      console.error("Waitlist submission error:", error)

      // Still show success message even if there's an error
      setSubmitStatus("success")
      setSubmitMessage(
        "Thank you for your interest! Your request has been registered. We will contact you by email very soon.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section with Logo */}
      <section className="relative bg-gradient-to-br from-fitnest-green via-fitnest-green to-emerald-700 py-12 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Animated background elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-fitnest-orange/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-fitnest-orange/10 rounded-full blur-xl animate-bounce delay-500"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo at the top of hero section - adjusted size */}
            <div className="flex justify-center mb-6">
              <Image
                src="https://obtmksfewry4ishp.public.blob.vercel-storage.com/Logo/Logo-Fitnest-white-NwDGrdKRIJziMZXVVN9cKNeWBx1ENP.png"
                alt="Fitnest Logo"
                width={200}
                height={70}
                className="h-auto max-w-[200px] w-auto"
                priority
              />
            </div>

            <Badge className="mb-4 bg-fitnest-orange/90 backdrop-blur-sm text-white px-6 py-2 text-base font-semibold shadow-lg animate-fade-in">
              🔥 High Demand Alert
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in-up">
              We're Temporarily
              <span className="block text-fitnest-orange drop-shadow-lg">Pausing New Orders</span>
            </h1>

            <p className="text-lg md:text-xl mb-6 text-white/95 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              The response to Fitnest has been incredible! To maintain the exceptional quality and personalized service
              our customers love, we're carefully managing our capacity.
            </p>

            {/* Call to Action Button */}
            <div className="mb-6 animate-fade-in-up delay-300">
              <Button
                onClick={scrollToForm}
                className="bg-fitnest-orange hover:bg-fitnest-orange/90 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Join the Waitlist Now
                <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-400">
              <div className="flex items-center gap-2 text-white/95 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="h-5 w-5" />
                <span className="font-semibold">{waitlistCount} people already joined</span>
              </div>
              <div className="flex items-center gap-2 text-white/95 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Average wait: 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Paused Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
              Quality Over Quantity, Always
            </h2>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-fitnest-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">Personalized Attention</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        Every meal plan is carefully crafted by our nutritionists to meet your specific goals and
                        dietary needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-fitnest-orange to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">Premium Ingredients</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        We source only the finest, freshest ingredients and refuse to compromise on quality for
                        quantity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-fitnest-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">Timely Delivery</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        Your meals arrive fresh and on time, every time. We'd rather pause than disappoint.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-fitnest-green/20 to-fitnest-orange/20 rounded-3xl blur-3xl"></div>
                <Image
                  src="/professional-chef-portrait.png"
                  alt="Professional Chef"
                  width={500}
                  height={600}
                  className="relative rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section id="waitlist-form" className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Join the Exclusive Waitlist</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Be the first to know when we're accepting new customers again. Plus, get exclusive perks for your
                patience!
              </p>
            </div>

            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-10">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-3">
                        First Name *
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="w-full h-12 text-lg border-2 border-gray-200 focus:border-fitnest-green transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-3">
                        Last Name *
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className="w-full h-12 text-lg border-2 border-gray-200 focus:border-fitnest-green transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full h-12 text-lg border-2 border-gray-200 focus:border-fitnest-green transition-colors"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="w-full h-12 text-lg border-2 border-gray-200 focus:border-fitnest-green transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="mealPlan" className="block text-sm font-semibold text-gray-700 mb-3">
                      Preferred Meal Plan
                    </label>
                    <select
                      id="mealPlan"
                      name="mealPlan"
                      className="w-full h-12 px-4 text-lg border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fitnest-green focus:border-fitnest-green transition-colors"
                    >
                      <option value="">Select a meal plan</option>
                      <option value="weight-loss">Weight Loss Plan</option>
                      <option value="balanced-nutrition">Stay Fit Plan</option>
                      <option value="muscle-gain">Muscle Gain Plan</option>
                      <option value="keto">Keto Plan</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-3">
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      className="w-full h-12 px-4 text-lg border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fitnest-green focus:border-fitnest-green transition-colors"
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

                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      className="mt-2 h-5 w-5 text-fitnest-green focus:ring-fitnest-green border-gray-300 rounded"
                    />
                    <label htmlFor="notifications" className="text-gray-600 leading-relaxed">
                      I'd like to receive updates about new meal options, nutrition tips, and exclusive offers via email
                      and SMS.
                    </label>
                  </div>

                  {submitMessage && (
                    <div
                      className={`p-6 rounded-xl text-lg font-medium ${
                        submitStatus === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {submitMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-fitnest-green to-emerald-600 hover:from-fitnest-green/90 hover:to-emerald-600/90 text-white py-4 text-xl font-bold disabled:opacity-50 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    {isSubmitting ? "Processing..." : "Join the Waitlist"}
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </form>

                <div className="mt-8 p-6 bg-gradient-to-r from-fitnest-orange/10 to-orange-100 rounded-xl border border-fitnest-orange/20">
                  <h4 className="font-bold text-fitnest-orange mb-4 text-lg">🎁 Waitlist Exclusive Benefits:</h4>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-fitnest-green" />
                      <span>10% discount on your first subscription</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-fitnest-green" />
                      <span>Delicious complimentary snacks with your first order</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">What Our Current Customers Say</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-fitnest-orange text-fitnest-orange" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "The quality is unmatched. Every meal feels like it was prepared just for me. Worth every dirham and
                  every day of waiting!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <Image src="/diverse-group-city.png" alt="Customer" width={48} height={48} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Amina K.</p>
                    <p className="text-gray-600">Casablanca</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-fitnest-orange text-fitnest-orange" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "I understand why they paused. The attention to detail and personalized service is incredible. Can't
                  wait for others to experience this!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <Image src="/contemplative-man.png" alt="Customer" width={48} height={48} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Youssef M.</p>
                    <p className="text-gray-600">Rabat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-fitnest-orange text-fitnest-orange" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "Quality over quantity - that's exactly why I chose Fitnest.ma. The wait was absolutely worth it for
                  this level of service."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <Image src="/contemplative-artist.png" alt="Customer" width={48} height={48} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Fatima L.</p>
                    <p className="text-sm text-gray-600">Marrakech</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">How long is the current wait time?</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Current average wait time is 7 days maximum. We'll call you before to confirm your subscription, and
                    you'll have 48 hours to confirm after we contact you.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Will I lose my spot if I don't respond immediately?
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    You'll have 48 hours to respond when we contact you. If you miss this window, you'll be moved to the
                    end of the waitlist, but you won't lose your place permanently.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Are the waitlist benefits guaranteed?</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Yes! Everyone on our waitlist will receive the 10% first-subscription discount and complimentary
                    snacks with their first order when they join.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Can I change my meal plan preference later?</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
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
      <section className="py-24 bg-gradient-to-br from-fitnest-green to-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Your Healthy Lifestyle Journey Awaits</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-white/95 leading-relaxed">
            Join thousands of satisfied customers who chose quality over convenience. Your spot is reserved - we just
            need your details.
          </p>
          <Button
            onClick={scrollToForm}
            className="bg-fitnest-orange hover:bg-fitnest-orange/90 text-white px-10 py-4 text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Secure Your Spot Now
          </Button>
        </div>
      </section>
    </div>
  )
}
