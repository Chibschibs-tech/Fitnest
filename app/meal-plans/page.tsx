import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { allMealPlans } from "@/lib/meal-plan-data"
import { Badge } from "@/components/ui/badge"

export default function MealPlansPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Meal Plans Tailored to Your Goals</h1>
        <p className="text-lg text-gray-600">
          Our chef-prepared meals are designed to help you reach your health and fitness goals with delicious,
          nutritionally balanced options for every lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {allMealPlans.map((plan) => (
          <Card key={plan.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative h-48">
              <Image
                src={plan.image || "/placeholder.svg"}
                alt={plan.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex flex-wrap gap-2 pt-2">
                {plan.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <p className="text-2xl font-bold text-emerald-600">
                {plan.price} MAD<span className="text-sm text-gray-500 font-normal"> / {plan.duration}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link href={`/meal-plans/${plan.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
                <Link href={`/order?plan=${plan.id}`} className="flex-1">
                  <Button className="w-full bg-fitnest-green hover:bg-fitnest-green/90">Order Now</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-8 md:p-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Not sure which plan is right for you?</h2>
            <p className="text-gray-600 mb-6">
              Take our quick quiz to get personalized recommendations based on your lifestyle, goals, and preferences.
            </p>
            <Link href="/meal-quiz">
              <Button className="bg-fitnest-green hover:bg-fitnest-green/90">
                Take the Quiz <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">All plans include:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Fresh, chef-prepared meals delivered to your door</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Flexible delivery schedule to fit your lifestyle</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>No commitment - pause or cancel anytime</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
