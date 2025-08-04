"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { allMealPlans } from "@/lib/meal-plan-data"

export function FeaturedMealPlans() {
  // Display the first 3 plans as featured
  const featuredPlans = allMealPlans.slice(0, 3)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Popular Meal Plans</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our chef-crafted meal plans designed to meet your nutritional goals and satisfy your taste buds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative h-48">
                <Image src={plan.image || "/placeholder.svg"} alt={plan.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-600">
                  {plan.price} MAD<span className="text-sm text-gray-500 font-normal"> / {plan.duration}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/meal-plans/${plan.id}`} className="w-full">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">View Plan</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/meal-plans">
            <Button
              variant="outline"
              size="lg"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              View All Meal Plans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
