import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, Utensils } from "lucide-react"
import { allMealPlans } from "@/lib/meal-plan-data"

export default function MealPlanPage({ params }: { params: { id: string } }) {
  const plan = allMealPlans.find((p) => p.id === params.id)

  if (!plan) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-fitnest-green to-green-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">{plan.calories} calories per day</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{plan.name}</h1>
              <p className="text-xl mb-6 text-green-100">{plan.description}</p>
              <div className="flex items-center gap-4 mb-8">
                <div className="text-3xl font-bold">
                  {plan.price} MAD/{plan.duration}
                </div>
                {plan.originalPrice && (
                  <div className="text-lg line-through text-green-200">{plan.originalPrice} MAD</div>
                )}
              </div>
              <Link href={`/order?plan=${plan.id}`}>
                <Button size="lg" className="bg-fitnest-orange hover:bg-orange-600 text-white">
                  Start Your Plan
                </Button>
              </Link>
            </div>
            <div className="relative h-64 w-full md:h-auto">
              <Image
                src={plan.heroImage || "/placeholder.svg"}
                alt={plan.name}
                fill
                className="object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plan Details */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About This Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-fitnest-green">About This Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{plan.longDescription}</p>
              </CardContent>
            </Card>

            {/* Sample Meals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-fitnest-green">Sample Meals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plan.sampleMeals.map((meal, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="relative w-full h-32 mb-3">
                        <Image
                          src={meal.image || "/placeholder.svg"}
                          alt={meal.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{meal.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                      <div className="text-sm font-medium text-fitnest-green">{meal.calories} calories</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-fitnest-green">Plan Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {plan.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-fitnest-green flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-fitnest-green">Plan Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-fitnest-green flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-fitnest-green">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Utensils className="h-5 w-5 text-fitnest-orange" />
                  <div>
                    <div className="font-medium">Daily Calories</div>
                    <div className="text-sm text-gray-600">{plan.calories}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-fitnest-orange" />
                  <div>
                    <div className="font-medium">Protein per Meal</div>
                    <div className="text-sm text-gray-600">{plan.protein}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-fitnest-orange" />
                  <div>
                    <div className="font-medium">Delivery</div>
                    <div className="text-sm text-gray-600">Fresh daily</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-fitnest-green text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
                <p className="text-green-100 mb-4">Join thousands of satisfied customers</p>
                <Link href={`/order?plan=${plan.id}`}>
                  <Button className="w-full bg-fitnest-orange hover:bg-orange-600">
                    Order Now - {plan.price} MAD/week
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
