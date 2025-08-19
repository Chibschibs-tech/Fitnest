import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Users, Clock, Shield, Zap, Heart, Award } from "lucide-react"

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-4 py-2">
                  🚀 Coming Soon to Morocco
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Transform Your Health with
                  <span className="text-green-300 block">Fitnest.ma</span>
                </h1>
                <p className="text-xl text-green-100 leading-relaxed">
                  Morocco's first premium meal delivery service designed by nutritionists. Fresh, healthy, and delicious
                  meals delivered to your door.
                </p>
              </div>

              {/* Waitlist Form */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-green-100 mb-2">Join the Waitlist</label>
                      <div className="flex gap-3">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-green-200"
                          required
                        />
                        <Button type="submit" className="bg-green-500 hover:bg-green-400 text-white px-8">
                          Join Now
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-green-200">
                      Be the first to know when we launch. No spam, just updates.
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Social Proof */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-300" />
                  <span className="text-green-100">500+ people waiting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-green-100">Nutritionist approved</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/hero-banner-full.png"
                alt="Healthy meal delivery"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Fresh Daily</p>
                    <p className="text-sm text-gray-600">Prepared with love</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Fitnest.ma?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing healthy eating in Morocco with science-backed nutrition and chef-crafted meals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Nutritionist Designed</h3>
                <p className="text-gray-600">
                  Every meal is crafted by certified nutritionists to meet your health goals and dietary requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Fresh & Local</h3>
                <p className="text-gray-600">
                  We source the finest ingredients from local Moroccan farms, ensuring freshness and supporting our
                  community.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Convenient Delivery</h3>
                <p className="text-gray-600">
                  Flexible delivery schedules that fit your lifestyle. Fresh meals delivered right to your doorstep.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meal Plans Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Meal Plans</h2>
            <p className="text-xl text-gray-600">Tailored nutrition plans for every lifestyle and goal</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <Image
                  src="/vibrant-weight-loss-meal.png"
                  alt="Weight Loss Plan"
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Weight Loss Plan</h3>
                  <p className="text-gray-600 mb-4">
                    Balanced, calorie-controlled meals designed to help you reach your weight goals.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">299 MAD/week</span>
                    <Badge className="bg-green-100 text-green-800">Most Popular</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <Image
                  src="/hearty-muscle-meal.png"
                  alt="Muscle Building Plan"
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Muscle Building Plan</h3>
                  <p className="text-gray-600 mb-4">
                    High-protein meals to fuel your workouts and build lean muscle mass.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">399 MAD/week</span>
                    <Badge className="bg-blue-100 text-blue-800">High Protein</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <Image
                  src="/colorful-keto-plate.png"
                  alt="Keto Plan"
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Keto Plan</h3>
                  <p className="text-gray-600 mb-4">Low-carb, high-fat meals perfect for the ketogenic lifestyle.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">349 MAD/week</span>
                    <Badge className="bg-purple-100 text-purple-800">Low Carb</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Beta Users Say</h2>
            <p className="text-xl text-gray-600">Real feedback from our early access program</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Finally, a meal service that understands Moroccan tastes while keeping it healthy. The flavors are
                  incredible!"
                </p>
                <div className="flex items-center gap-4">
                  <Image src="/contemplative-man.png" alt="Youssef" width={48} height={48} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900">Youssef M.</p>
                    <p className="text-sm text-gray-600">Casablanca</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "As a busy professional, Fitnest.ma has been a game-changer. Healthy eating has never been this
                  convenient."
                </p>
                <div className="flex items-center gap-4">
                  <Image src="/contemplative-artist.png" alt="Aicha" width={48} height={48} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900">Aicha K.</p>
                    <p className="text-sm text-gray-600">Rabat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Lost 8kg in 3 months with their weight loss plan. The nutritionist support made all the difference."
                </p>
                <div className="flex items-center gap-4">
                  <Image src="/diverse-group-city.png" alt="Omar" width={48} height={48} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900">Omar B.</p>
                    <p className="text-sm text-gray-600">Marrakech</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about Fitnest.ma</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">When will Fitnest.ma launch?</h3>
                <p className="text-gray-600">
                  We're planning to launch in Q2 2024, starting with Casablanca and Rabat. Join our waitlist to be
                  notified as soon as we're available in your area.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What cities will you serve?</h3>
                <p className="text-gray-600">
                  We'll start with Casablanca and Rabat, then expand to Marrakech, Fez, and other major cities across
                  Morocco based on demand.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How much will meal plans cost?</h3>
                <p className="text-gray-600">
                  Our meal plans will start from 299 MAD per week for the Weight Loss plan, with options for different
                  dietary needs and portion sizes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I customize my meals?</h3>
                <p className="text-gray-600">
                  We'll offer extensive customization options including dietary restrictions, allergies, and personal
                  preferences to ensure every meal is perfect for you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Transform Your Health?</h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of Moroccans who are already waiting for the future of healthy eating.
            </p>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md mx-auto">
              <CardContent className="p-6">
                <form className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-white/20 border-white/30 text-white placeholder:text-green-200"
                    required
                  />
                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-white">
                    Join the Waitlist
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-green-100">No commitment required</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-300" />
                <span className="text-green-100">Early bird discounts</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
