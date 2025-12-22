import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { ArrowRight, Check, Sparkles, TrendingUp } from "lucide-react"
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden border-t-4 border-gray-200">
          <CardHeader className="pb-0">
            <Skeleton className="h-48 w-full -mx-6 -mt-6 mb-4 rounded-none" />
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
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
      className="group overflow-hidden border-t-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
      style={{ borderTopColor: planColor }}
    >
      <CardHeader className="pb-0 relative">
        <div className="relative h-56 -mx-6 -mt-6 mb-4 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={plan.image || "/placeholder.svg"}
            alt={plan.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badge overlay */}
          {plan.calories && (
            <Badge 
              className="absolute top-4 right-4 bg-white/90 text-gray-900 hover:bg-white shadow-lg backdrop-blur-sm"
              style={{ borderColor: planColor }}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {plan.calories} cal
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-2xl font-bold mb-2 group-hover:text-fitnest-green transition-colors">
          {plan.name}
        </CardTitle>
        <CardDescription className="text-base text-gray-600 leading-relaxed min-h-[3rem]">
          {plan.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pt-4">
        {/* Price display */}
        {plan.price && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-sm text-gray-500">MAD/week</span>
            </div>
          </div>
        )}
        
        {/* Features list */}
        {plan.features && plan.features.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: planColor }} />
              Key Features
            </h4>
            <ul className="space-y-2">
              {plan.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <Check 
                    className="h-4 w-4 mt-0.5 flex-shrink-0" 
                    style={{ color: planColor }}
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
              {plan.features.length > 4 && (
                <li className="text-xs text-gray-500 pl-6">
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
            className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white group/btn transition-all duration-200 shadow-md hover:shadow-lg"
            size="lg"
          >
            Learn More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
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
      <div className="text-center py-16 md:py-24">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
          <Sparkles className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No meal plans available</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We're currently updating our meal plans. Check back soon or contact us for more information.
        </p>
        <Link href="/order">
          <Button size="lg" className="bg-fitnest-green hover:bg-fitnest-green/90 text-white">
            Contact Us
            <ArrowRight className="ml-2 h-4 w-4" />
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
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 md:px-6">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Meal Plans Tailored to Your Goals
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Our chef-prepared meals are designed to help you reach your health and fitness goals with delicious,
          nutritionally balanced options for every lifestyle.
        </p>
      </div>

      {/* Meal Plans Grid with Suspense */}
      <Suspense fallback={<MealPlanSkeleton />}>
        <MealPlansGrid />
      </Suspense>

      {/* CTA Section */}
      <div className="text-center max-w-3xl mx-auto pt-8 md:pt-12 border-t border-gray-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-fitnest-green/10 mb-6">
          <Sparkles className="h-8 w-8 text-fitnest-green" />
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
          Ready to start your healthy eating journey?
        </h2>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Choose your plan, customize your meals, and enjoy delicious, nutritious food delivered fresh to your door.
        </p>
        <Link href="/order">
          <Button 
            size="lg" 
            className="bg-fitnest-green hover:bg-fitnest-green/90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            Order Your Meals Now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
