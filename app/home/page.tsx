import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Star, Clock, Truck, Award, Check } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Full banner with enhanced CTAs and overlay */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[calc(100vh-73px)] flex items-end bg-gray-100">
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1]" />
        <Image
          src="https://obtmksfewry4ishp.public.blob.vercel-storage.com/hero%20banner"
          alt="Fitnest.ma - Healthy meal delivery service in Morocco"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="relative z-10 container mx-auto px-4 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Star className="h-4 w-4 text-fitnest-orange fill-fitnest-orange" />
              <span className="text-sm font-medium text-gray-900">Trusted by 1000+ Happy Customers</span>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4">
              <Link href="/meal-plans" className="w-full sm:w-auto">
                <Button 
                  className="bg-fitnest-orange text-white hover:bg-fitnest-orange/90 hover:scale-105 transition-all duration-200 w-full sm:w-auto text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-6 shadow-xl hover:shadow-2xl"
                  aria-label="View our meal plans"
                >
                  View Meal Plans
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/how-it-works" className="w-full sm:w-auto">
                <Button 
                  variant="outline"
                  className="bg-white/95 backdrop-blur-sm text-fitnest-green hover:bg-white border-2 border-white hover:scale-105 transition-all duration-200 w-full sm:w-auto text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-6 shadow-xl"
                  aria-label="Learn how our service works"
                >
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Quick Stats */}
      <section className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 py-8 border-b border-fitnest-green/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                <p className="text-2xl md:text-3xl font-bold">30min</p>
              </div>
              <p className="text-xs md:text-sm text-white/90">Delivery Time</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 fill-white" />
                <p className="text-2xl md:text-3xl font-bold">4.9</p>
              </div>
              <p className="text-xs md:text-sm text-white/90">Customer Rating</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5" />
                <p className="text-2xl md:text-3xl font-bold">1000+</p>
              </div>
              <p className="text-xs md:text-sm text-white/90">Happy Customers</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Truck className="h-5 w-5" />
                <p className="text-2xl md:text-3xl font-bold">Free</p>
              </div>
              <p className="text-xs md:text-sm text-white/90">Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Meal Plans Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Our Meal Plans
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Choose from our selection of chef-prepared meal plans designed to meet your specific health and fitness goals. Each meal is crafted with fresh ingredients and balanced nutrition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Weight Loss Plan */}
            <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src="/weight-loss-meal.png" 
                  alt="Weight Loss Meal Plan - Healthy calorie-controlled meals" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute top-3 right-3 bg-fitnest-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Popular
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-fitnest-green transition-colors">
                  Weight Loss Plan
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Calorie-controlled meals designed to help you lose weight while staying satisfied.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fitnest-green">350 MAD</span>
                    <span className="text-sm text-gray-500">/week</span>
                  </div>
                  <Link href="/meal-plans/weight-loss" className="w-full">
                    <Button 
                      size="sm" 
                      className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white transition-all hover:shadow-lg"
                      aria-label="View Weight Loss Plan details"
                    >
                      View Plan
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>

            {/* Stay Fit Plan */}
            <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src="/vibrant-nutrition-plate.png" 
                  alt="Stay Fit Meal Plan - Balanced nutrition for active lifestyle" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-fitnest-green transition-colors">
                  Stay Fit Plan
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Balanced nutrition to maintain your weight and support an active lifestyle.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fitnest-green">320 MAD</span>
                    <span className="text-sm text-gray-500">/week</span>
                  </div>
                  <Link href="/meal-plans/balanced-nutrition" className="w-full">
                    <Button 
                      size="sm" 
                      className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white transition-all hover:shadow-lg"
                      aria-label="View Stay Fit Plan details"
                    >
                      View Plan
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>

            {/* Muscle Gain Plan */}
            <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src="/muscle-gain-meal.png" 
                  alt="Muscle Gain Meal Plan - High protein meals for muscle building" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-fitnest-green transition-colors">
                  Muscle Gain Plan
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Protein-rich meals to support muscle growth and recovery after workouts.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fitnest-green">400 MAD</span>
                    <span className="text-sm text-gray-500">/week</span>
                  </div>
                  <Link href="/meal-plans/muscle-gain" className="w-full">
                    <Button 
                      size="sm" 
                      className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white transition-all hover:shadow-lg"
                      aria-label="View Muscle Gain Plan details"
                    >
                      View Plan
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>

            {/* Keto Plan */}
            <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src="/keto-meal.png" 
                  alt="Keto Meal Plan - Low-carb high-fat ketogenic diet" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-fitnest-green transition-colors">
                  Keto Plan
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Low-carb, high-fat meals designed to help you achieve and maintain ketosis.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fitnest-green">380 MAD</span>
                    <span className="text-sm text-gray-500">/week</span>
                  </div>
                  <Link href="/meal-plans/keto" className="w-full">
                    <Button 
                      size="sm" 
                      className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white transition-all hover:shadow-lg"
                      aria-label="View Keto Plan details"
                    >
                      View Plan
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-12 text-center">
            <Link href="/meal-plans">
              <Button
                size="lg"
                className="bg-fitnest-orange text-white hover:bg-fitnest-orange/90 hover:scale-105 transition-all shadow-lg hover:shadow-xl px-8 py-6"
                aria-label="View all available meal plans"
              >
                View All Meal Plans
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="mb-4 text-4xl md:text-5xl font-bold">How It Works</h2>
            <p className="text-lg text-gray-600">
              Get started with Fitnest in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative group">
              <div className="text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute inset-0 bg-fitnest-green/20 rounded-full blur-xl group-hover:bg-fitnest-green/30 transition-all" />
                  <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-fitnest-green to-fitnest-green/80 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold">Choose Your Plan</h3>
                <p className="text-gray-600">
                  Select a meal plan that fits your goals and dietary preferences
                </p>
              </div>
              {/* Connector Line - Hidden on mobile */}
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-fitnest-green/30 to-transparent" />
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute inset-0 bg-fitnest-orange/20 rounded-full blur-xl group-hover:bg-fitnest-orange/30 transition-all" />
                  <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-fitnest-orange to-fitnest-orange/80 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold">Customize & Order</h3>
                <p className="text-gray-600">
                  Personalize your meals and schedule your delivery times
                </p>
              </div>
              {/* Connector Line - Hidden on mobile */}
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-fitnest-orange/30 to-transparent" />
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute inset-0 bg-fitnest-green/20 rounded-full blur-xl group-hover:bg-fitnest-green/30 transition-all" />
                  <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-fitnest-green to-fitnest-green/80 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold">Enjoy Your Meals</h3>
                <p className="text-gray-600">
                  Receive fresh, ready-to-eat meals delivered to your doorstep
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/how-it-works">
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-fitnest-green text-fitnest-green hover:bg-fitnest-green hover:text-white transition-all px-8"
              >
                Learn More About Our Process
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="mb-4 text-4xl md:text-5xl font-bold">Why Choose Fitnest</h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied customers who have transformed their lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group rounded-2xl p-8 text-center shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-fitnest-green to-fitnest-green/80 text-white shadow-lg group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold">Health First</h3>
              <p className="text-gray-600 leading-relaxed">
                Every meal is designed by nutritionists to fuel your body and promote long-term well-being with balanced macros.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl p-8 text-center shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-fitnest-orange to-fitnest-orange/80 text-white shadow-lg group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold">Simple & Convenient</h3>
              <p className="text-gray-600 leading-relaxed">
                No meal prep, no grocery shopping. Fresh meals delivered to your door, ready to eat in minutes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl p-8 text-center shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-fitnest-green to-fitnest-green/80 text-white shadow-lg group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold">Lifestyle Transformation</h3>
              <p className="text-gray-600 leading-relaxed">
                More than just meals - we support your entire wellness journey with expert guidance and education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="mb-4 text-4xl md:text-5xl font-bold">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">
              Real stories from real people achieving their health goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-fitnest-orange text-fitnest-orange" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "Fitnest has completely changed my relationship with food. The meals are delicious and I've lost 8kg in 3 months!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fitnest-green to-fitnest-green/80 flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div>
                  <p className="font-bold">Sarah M.</p>
                  <p className="text-sm text-gray-500">Weight Loss Plan</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-fitnest-orange text-fitnest-orange" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "As a busy professional, Fitnest saves me hours each week. The muscle gain plan is perfect for my fitness goals."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fitnest-orange to-fitnest-orange/80 flex items-center justify-center text-white font-bold text-lg">
                  K
                </div>
                <div>
                  <p className="font-bold">Karim B.</p>
                  <p className="text-sm text-gray-500">Muscle Gain Plan</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-fitnest-orange text-fitnest-orange" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "The variety and quality of meals exceeded my expectations. Delivery is always on time and customer service is excellent."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fitnest-green to-fitnest-green/80 flex items-center justify-center text-white font-bold text-lg">
                  L
                </div>
                <div>
                  <p className="font-bold">Leila A.</p>
                  <p className="text-sm text-gray-500">Stay Fit Plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section - Improved mobile horizontal scrolling */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="mb-4 text-4xl md:text-5xl font-bold">Latest from Our Blog</h2>
            <p className="text-lg text-gray-600">
              Expert advice on nutrition, fitness, and healthy living to help you achieve your wellness goals.
            </p>
          </div>

          {/* Mobile Horizontal Scrolling Blog Posts with Snap Scroll */}
          <div className="md:hidden mb-8">
            <div className="relative">
              {/* Scroll Hint */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="bg-fitnest-orange/90 text-white text-xs px-3 py-2 rounded-full shadow-lg animate-pulse">
                  Swipe →
                </div>
              </div>
              
              <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                <div className="flex gap-4 pb-6">
                  {/* Blog Post 1 */}
                  <article className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=176&width=320"
                        alt="Meal Prep Tips for Busy Professionals"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold px-3 py-1 bg-fitnest-green/10 text-fitnest-green rounded-full">
                          Meal Prep
                        </span>
                        <span className="text-xs text-gray-500">5 min read</span>
                      </div>
                      <h3 className="text-lg font-bold mb-3 line-clamp-2">
                        10 Healthy Meal Prep Tips for Busy Professionals
                      </h3>
                      <Link
                        href="/blog/healthy-meal-prep"
                        className="inline-flex items-center text-fitnest-orange font-semibold text-sm hover:gap-2 transition-all"
                        aria-label="Read article about meal prep tips"
                      >
                        Read More <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </article>

                  {/* Blog Post 2 */}
                  <article className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=176&width=320"
                        alt="Common Nutrition Myths Debunked"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold px-3 py-1 bg-fitnest-orange/10 text-fitnest-orange rounded-full">
                          Nutrition
                        </span>
                        <span className="text-xs text-gray-500">7 min read</span>
                      </div>
                      <h3 className="text-lg font-bold mb-3 line-clamp-2">
                        5 Common Nutrition Myths Debunked
                      </h3>
                      <Link
                        href="/blog/nutrition-myths"
                        className="inline-flex items-center text-fitnest-orange font-semibold text-sm hover:gap-2 transition-all"
                        aria-label="Read article about nutrition myths"
                      >
                        Read More <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </article>

                  {/* Blog Post 3 */}
                  <article className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=176&width=320"
                        alt="Breaking Through Weight Loss Plateaus"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold px-3 py-1 bg-fitnest-green/10 text-fitnest-green rounded-full">
                          Fitness
                        </span>
                        <span className="text-xs text-gray-500">8 min read</span>
                      </div>
                      <h3 className="text-lg font-bold mb-3 line-clamp-2">
                        Breaking Through a Weight Loss Plateau
                      </h3>
                      <Link
                        href="/blog/weight-loss-plateau"
                        className="inline-flex items-center text-fitnest-orange font-semibold text-sm hover:gap-2 transition-all"
                        aria-label="Read article about weight loss plateaus"
                      >
                        Read More <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Blog Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-52 overflow-hidden">
                <Image 
                  src="/placeholder.svg?height=208&width=384" 
                  alt="Meal Prep Tips for Busy Professionals" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-3 py-1 bg-fitnest-green/10 text-fitnest-green rounded-full">
                    Meal Prep
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    5 min read
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-fitnest-green transition-colors">
                  10 Healthy Meal Prep Tips for Busy Professionals
                </h3>
                <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                  Learn how to efficiently prepare nutritious meals for the entire week, even with a busy schedule.
                </p>
                <Link href="/blog/healthy-meal-prep" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-fitnest-orange text-fitnest-orange hover:bg-fitnest-orange hover:text-white transition-all"
                    aria-label="Read meal prep tips article"
                  >
                    Read More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </article>

            {/* Blog Post 2 */}
            <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-52 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=208&width=384"
                  alt="Common Nutrition Myths Debunked"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-3 py-1 bg-fitnest-orange/10 text-fitnest-orange rounded-full">
                    Nutrition
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    7 min read
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-fitnest-orange transition-colors">
                  5 Common Nutrition Myths Debunked
                </h3>
                <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                  Separating fact from fiction: nutrition experts weigh in on popular diet claims and misconceptions.
                </p>
                <Link href="/blog/nutrition-myths" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-fitnest-orange text-fitnest-orange hover:bg-fitnest-orange hover:text-white transition-all"
                    aria-label="Read nutrition myths article"
                  >
                    Read More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </article>

            {/* Blog Post 3 */}
            <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-52 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=208&width=384"
                  alt="Breaking Through Weight Loss Plateaus"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-3 py-1 bg-fitnest-green/10 text-fitnest-green rounded-full">
                    Fitness
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    8 min read
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-fitnest-green transition-colors">
                  Breaking Through a Weight Loss Plateau
                </h3>
                <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                  Effective strategies to overcome stalled progress and continue your weight loss journey.
                </p>
                <Link href="/blog/weight-loss-plateau" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-fitnest-orange text-fitnest-orange hover:bg-fitnest-orange hover:text-white transition-all"
                    aria-label="Read weight loss plateau article"
                  >
                    Read More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </article>
          </div>

          <div className="mt-12 text-center">
            <Link href="/blog">
              <Button 
                size="lg"
                className="bg-fitnest-orange text-white hover:bg-fitnest-orange/90 hover:scale-105 transition-all shadow-lg px-8 py-6"
                aria-label="View all blog articles"
              >
                View All Articles
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Express Shop Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Express Shop
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover our selection of healthy snacks and supplements to complement your meal plans and keep you energized throughout the day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Protein Bar */}
            <article className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src="/protein-bar.png" 
                  alt="Protein Power Bars - High protein snacks" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-fitnest-green transition-colors">
                  Protein Power Bars
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  High-protein bars perfect for post-workout recovery or a quick energy boost.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fitnest-green">25 MAD</span>
                    <span className="text-sm text-gray-500">/bar</span>
                  </div>
                  <Link href="/express-shop?category=protein_bars" className="w-full">
                    <Button 
                      size="sm" 
                      className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white transition-all hover:shadow-lg"
                      aria-label="Shop protein power bars"
                    >
                      Shop Now
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>

            {/* Granola */}
            <article className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src="/honey-almond-granola.png" 
                  alt="Premium Granola - Honey almond breakfast" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-fitnest-green transition-colors">
                  Premium Granola
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Crunchy granola with premium ingredients, perfect for breakfast or snacking.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fitnest-green">32 MAD</span>
                    <span className="text-sm text-gray-500">/pack</span>
                  </div>
                  <Link href="/express-shop?category=granola" className="w-full">
                    <Button 
                      size="sm" 
                      className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white transition-all hover:shadow-lg"
                      aria-label="Shop premium granola"
                    >
                      Shop Now
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>

            {/* Energy Balls */}
            <article className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src="/placeholder.svg?height=192&width=256" 
                  alt="Energy Balls - Natural superfood snacks" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-fitnest-green transition-colors">
                  Energy Balls
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Natural energy balls made with dates, nuts, and superfoods for sustained energy.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fitnest-green">40 MAD</span>
                    <span className="text-sm text-gray-500">/pack</span>
                  </div>
                  <Link href="/express-shop?category=energy_balls" className="w-full">
                    <Button 
                      size="sm" 
                      className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white transition-all hover:shadow-lg"
                      aria-label="Shop energy balls"
                    >
                      Shop Now
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>

            {/* Breakfast Mixes */}
            <article className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src="/healthy-protein-pancake-mix.png" 
                  alt="Breakfast Mixes - Protein pancakes and oats" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-fitnest-green transition-colors">
                  Breakfast Mixes
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Quick and nutritious breakfast options including protein pancakes and overnight oats.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fitnest-green">50 MAD</span>
                    <span className="text-sm text-gray-500">/pack</span>
                  </div>
                  <Link href="/express-shop?category=breakfast" className="w-full">
                    <Button 
                      size="sm" 
                      className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white transition-all hover:shadow-lg"
                      aria-label="Shop breakfast mixes"
                    >
                      Shop Now
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-12 text-center">
            <Link href="/express-shop">
              <Button 
                size="lg"
                className="bg-fitnest-orange text-white hover:bg-fitnest-orange/90 hover:scale-105 transition-all shadow-lg hover:shadow-xl px-8 py-6"
                aria-label="Visit Express Shop for more products"
              >
                Visit Express Shop
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-fitnest-green via-fitnest-green to-fitnest-green/90 py-24 text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-fitnest-orange rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Ready to Transform Your Lifestyle?
            </h2>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Join 1000+ happy customers who have transformed their lives through healthy eating. Start your wellness journey today with chef-prepared meals delivered to your door.
            </p>

            {/* Benefits List */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 py-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Check className="h-5 w-5 text-fitnest-orange" />
                <span className="text-sm md:text-base font-medium">No commitment</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Check className="h-5 w-5 text-fitnest-orange" />
                <span className="text-sm md:text-base font-medium">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Check className="h-5 w-5 text-fitnest-orange" />
                <span className="text-sm md:text-base font-medium">Free delivery</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/order">
                <Button 
                  size="lg"
                  className="bg-fitnest-orange text-white hover:bg-fitnest-orange/90 hover:scale-105 transition-all shadow-2xl hover:shadow-fitnest-orange/50 px-10 py-7 text-lg font-semibold"
                  aria-label="Get started with Fitnest meal plans"
                >
                  Get Started Today
                  <ChevronRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/meal-plans">
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-fitnest-green transition-all px-10 py-7 text-lg font-semibold"
                  aria-label="Browse all meal plans"
                >
                  Browse Meal Plans
                </Button>
              </Link>
            </div>

            {/* Trust Indicator */}
            <p className="text-sm md:text-base text-white/80 pt-6">
              🌟 Rated 4.9/5 by over 1000+ customers
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
