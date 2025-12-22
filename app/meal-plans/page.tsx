import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { ArrowRight, Check, Sparkles, TrendingUp, Flame, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Type for meal plan data from API
interface MealPlan {
  id: string
  name: string
  description: string
  calories: string
  price: string
  features: string[]
  image: string
  color?: string
}

// Color mapping for plans without color field
const getPlanColor = (title: string): string => {
  const colors: Record<string, string> = {
    "Weight Loss": "#22c55e",
    "Stay Fit": "#3b82f6", 
    "Muscle Gain": "#8b5cf6",
    "Keto": "#f97316",
  }
  return colors[title] || "#3b82f6"
}

async function getMealPlans(): Promise<MealPlan[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
  
  try {
    const response = await fetch(`${API_BASE}/meal-plans?status=active`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Handle different API response structures
    return Array.isArray(data.data) ? data.data : data
  } catch (error) {
    console.error('Failed to fetch meal plans:', error)
    // Return fallback data in case of error
    return []
  }
}

// Loading skeleton component
function MealPlanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden rounded-3xl border-0 shadow-md">
          <CardHeader className="pb-0">
            <Skeleton className="h-56 w-full -mx-6 -mt-6 mb-4 rounded-none" />
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Skeleton className="h-12 w-full rounded-xl" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

// Meal plan card component
function MealPlanCard({ plan }: { plan: MealPlan }) {
  const planColor = plan?.color || getPlanColor(plan.name)
  
  return (
    <Card
      className="group relative overflow-hidden rounded-3xl border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full bg-white"
    >
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fitnest-green via-fitnest-orange to-fitnest-green opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-0 relative">
        <div className="relative h-56 -mx-6 -mt-6 mb-4 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={plan.image || "/placeholder.svg"}
            alt={plan.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badge overlay */}
          {plan.calories && (
            <Badge 
              className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-gray-900 hover:bg-white shadow-lg border-0 font-bold"
            >
              <Flame className="h-3.5 w-3.5 mr-1.5 text-fitnest-orange" />
              {plan.calories}
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-2xl font-bold mb-3 text-gray-900 group-hover:bg-gradient-to-r group-hover:from-fitnest-green group-hover:to-fitnest-orange group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
          {plan.name}
        </CardTitle>
        <CardDescription className="text-base text-gray-600 leading-relaxed min-h-[3rem]">
          {plan.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pt-4">
        {/* Price display */}
        {plan.price && (
          <div className="mb-5 p-4 bg-gradient-to-br from-fitnest-green/5 to-fitnest-orange/5 rounded-2xl border border-fitnest-green/10">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-sm text-gray-600 font-medium">From</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                {plan.price}
              </span>
              <span className="text-sm text-gray-600 font-medium">MAD/week</span>
            </div>
          </div>
        )}
        
        {/* Features list */}
        {plan.features && plan.features.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="bg-fitnest-green/10 rounded-lg p-1.5">
                <Sparkles className="h-3.5 w-3.5 text-fitnest-green" />
              </div>
              Key Features
            </h4>
            <ul className="space-y-2.5">
              {plan.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm text-gray-600 font-medium">
                  <div className="bg-fitnest-green/10 rounded-full p-0.5 mt-0.5">
                    <Check 
                      className="h-3.5 w-3.5 text-fitnest-green" 
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
              {plan.features.length > 4 && (
                <li className="text-xs text-gray-500 pl-6 font-semibold">
                  +{plan.features.length - 4} more features
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-4 pb-6">
        <Link href={`/meal-plans/${plan.id}`} className="w-full">
          <Button 
            className="w-full bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white group/btn transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl font-bold"
            size="lg"
          >
            <span>View Details</span>
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Meal plans grid component
async function MealPlansGrid() {
  const mealPlans = await getMealPlans()

  if (mealPlans.length === 0) {
    return (
      <div className="text-center py-16 md:py-24 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-fitnest-green/10 to-fitnest-orange/10 mb-6">
          <Sparkles className="h-10 w-10 text-fitnest-green" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">No meal plans available</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-base md:text-lg leading-relaxed font-medium">
          We're currently updating our meal plans. Check back soon or contact us for more information.
        </p>
        <Link href="/order">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white px-8 py-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <span>Contact Us</span>
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
      {mealPlans.map((plan) => (
        <MealPlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  )
}

export default function MealPlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 md:px-6">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-fitnest-green/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-fitnest-green" />
            <span className="text-sm font-semibold text-fitnest-green">Our Plans</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-gray-900">
            Meal Plans Tailored to{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Your Goals
            </span>
          </h1>
          <p className="text-base md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Our chef-prepared meals are designed to help you reach your health and fitness goals with delicious,
            nutritionally balanced options for every lifestyle.
          </p>
        </div>

        {/* Meal Plans Grid with Suspense */}
        <Suspense fallback={<MealPlanSkeleton />}>
          <MealPlansGrid />
        </Suspense>

        {/* CTA Section */}
        <div className="relative text-center max-w-4xl mx-auto pt-8 md:pt-12 mt-8 md:mt-12">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-fitnest-green/5 via-transparent to-fitnest-orange/5 rounded-3xl -z-10" />
          
          <div className="relative p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fitnest-green/20 to-fitnest-orange/20 mb-6 backdrop-blur-sm">
              <Sparkles className="h-8 w-8 text-fitnest-green" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
              Ready to Start Your{" "}
              <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                Healthy Journey?
              </span>
            </h2>
            <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
              Choose your plan, customize your meals, and enjoy delicious, nutritious food delivered fresh to your door.
            </p>
            <Link href="/order">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-fitnest-orange to-orange-500 hover:from-orange-500 hover:to-fitnest-orange text-white px-10 py-7 text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl font-bold group"
              >
                <span>Order Your Meals Now</span>
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
