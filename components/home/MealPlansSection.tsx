import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import type { MealPlan } from "@/lib/api/home"

interface MealPlansSectionProps {
  mealPlans: MealPlan[]
}

export function MealPlansSection({ mealPlans }: MealPlansSectionProps) {
  if (mealPlans.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <p className="text-gray-500 mb-6">Loading meal plans...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
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

        {/* Meal Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {mealPlans.map((plan, index) => (
            <article 
              key={plan.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={plan.image || "/placeholder.svg?height=192&width=256"} 
                  alt={`${plan.name} - ${plan.description}`} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                {index === 0 && (
                  <div className="absolute top-3 right-3 bg-fitnest-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Popular
                  </div>
                )}
                {plan.calories && (
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {plan.calories} cal
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-fitnest-green transition-colors">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                  {plan.description}
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fitnest-green">{plan.price}</span>
                    <span className="text-sm text-gray-500">MAD/week</span>
                  </div>
                  <Link href={`/meal-plans/${plan.id}`} className="w-full">
                    <Button 
                      size="sm" 
                      className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white transition-all hover:shadow-lg"
                      aria-label={`View ${plan.name} details`}
                    >
                      View Plan
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All CTA */}
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
  )
}
