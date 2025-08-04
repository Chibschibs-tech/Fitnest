import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const allMealPlans = [
{
  id: "weight-loss",
  name: "Weight Loss",
  description: "Calorie-controlled meals to help you lose weight.",
  price: 350,
  image: "/vibrant-weight-loss-meal.png",
  tags: ["Low Calorie", "High Protein"],
},
{
  id: "stay-fit",
  name: "Stay Fit",
  description: "Perfect for maintaining a healthy lifestyle with well-rounded nutrition.",
  price: "Starting from 160 MAD/week",
  image: "/vibrant-nutrition-plate.png",
  color: "blue",
  features: [
    "Balanced macronutrients",
    "Variety of ingredients",
    "Rich in vitamins and minerals",
    "Sustainable eating pattern",
  ],
},
{
  id: "muscle-gain",
  name: "Muscle Gain",
  description: "Protein-rich meals to support muscle growth.",
  price: 400,
  image: "/hearty-muscle-meal.png",
  tags: ["High Protein", "Performance"],
},
{
  id: "keto",
  name: "Keto",
  description: "Low-carb, high-fat meals to achieve ketosis.",
  price: 380,
  image: "/colorful-keto-plate.png",
  tags: ["Low Carb", "High Fat"],
},
]

export default function MealPlansPage() {
return (
  <div className="bg-gray-50">
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Meal Plans</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Whatever your health goal, we have a delicious, chef-crafted plan for you. All meals are made with fresh, high-quality ingredients and delivered to your door.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {allMealPlans.map((plan) => (
          <Card key={plan.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative h-48">
              <Image src={plan.image || "/placeholder.svg"} alt={plan.name} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <div className="flex flex-wrap gap-2 pt-2">
                {plan.tags && plan.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600">{plan.description}</p>
              {plan.features && (
                <ul className="list-disc list-inside mt-4">
                  {plan.features.map(feature => (
                    <li key={feature} className="text-gray-600">{feature}</li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <p className="text-2xl font-bold text-emerald-600">
                {plan.price} MAD<span className="text-sm text-gray-500 font-normal"> / week</span>
              </p>
              {/* FIX: Ensure this links to the correct detail page using the plan's ID (slug) */}
              <Link href={`/meal-plans/${plan.id}`} className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Learn More
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  </div>
)
}
