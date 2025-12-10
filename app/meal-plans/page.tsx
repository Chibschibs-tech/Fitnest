import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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

export default async function MealPlansPage() {
  const mealPlans = await getMealPlans()

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Meal Plans Tailored to Your Goals</h1>
        <p className="text-lg text-gray-600">
          Our chef-prepared meals are designed to help you reach your health and fitness goals with delicious,
          nutritionally balanced options for every lifestyle.
        </p>
      </div>

      {mealPlans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">No meal plans available at the moment.</p>
          <Link href="/order">
            <Button size="lg" className="bg-fitnest-green hover:bg-fitnest-green/90">
              Contact Us
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {mealPlans.map((plan) => (
            <Card
              key={plan.id}
              className="overflow-hidden border-t-4"
              style={{ borderTopColor: plan?.color || getPlanColor(plan.name) }}
            >
              <CardHeader className="pb-0">
                <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                  <Image
                    src={plan.image || "/placeholder.svg"}
                    alt={plan.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Link href={`/meal-plans/${plan.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                  <Link href={`/order?plan=${plan.id}`} className="flex-1">
                    <Button className="w-full bg-fitnest-green hover:bg-fitnest-green/90">
                      Order Now
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start your healthy eating journey?</h2>
        <p className="text-gray-600 mb-6">
          Choose your plan, customize your meals, and enjoy delicious, nutritious food delivered fresh to your door.
        </p>
        <Link href="/order">
          <Button size="lg" className="bg-fitnest-green hover:bg-fitnest-green/90">
            Order Your Meals Now
          </Button>
        </Link>
      </div>
    </div>
  )
}
