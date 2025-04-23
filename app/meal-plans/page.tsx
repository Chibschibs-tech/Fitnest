import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"

export default function MealPlansPage() {
  const plans = [
    {
      id: "weight-loss",
      title: "Weight Loss",
      description: "Designed to help you lose weight while maintaining energy and satisfaction.",
      calories: "1200-1500",
      price: 349,
      features: [
        "5 days per week",
        "3 meals per day",
        "Calorie-controlled portions",
        "High protein, low carb",
        "Weekly menu rotation",
        "Nutritionist support",
      ],
    },
    {
      id: "balanced",
      title: "Balanced Nutrition",
      description: "Perfect for maintaining a healthy lifestyle with balanced macronutrients.",
      calories: "1800-2000",
      price: 399,
      features: [
        "5 days per week",
        "3 meals per day",
        "Balanced macronutrients",
        "Variety of ingredients",
        "Weekly menu rotation",
        "Nutritionist support",
      ],
    },
    {
      id: "muscle-gain",
      title: "Muscle Gain",
      description: "High protein meals to support muscle growth and recovery after workouts.",
      calories: "2500-2800",
      price: 449,
      features: [
        "5 days per week",
        "3 meals + 2 snacks per day",
        "High protein content",
        "Complex carbohydrates",
        "Weekly menu rotation",
        "Nutritionist support",
      ],
    },
    {
      id: "keto",
      title: "Keto",
      description: "Low-carb, high-fat meals designed to keep you in ketosis.",
      calories: "1600-1800",
      price: 429,
      features: [
        "5 days per week",
        "3 meals per day",
        "Low carb, high fat",
        "Moderate protein",
        "Weekly menu rotation",
        "Nutritionist support",
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Meal Plans</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from our variety of meal plans designed to meet your nutritional goals and dietary preferences.
        </p>
      </div>

      <Tabs defaultValue="5-day" className="w-full mb-12">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="5-day">5 Day Plan</TabsTrigger>
            <TabsTrigger value="7-day">7 Day Plan</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="5-day">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <p className="text-sm text-gray-500">{plan.calories} calories</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="text-3xl font-bold mb-6">
                    {plan.price} <span className="text-sm font-normal text-gray-500">MAD/week</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Select Plan</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="7-day">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <p className="text-sm text-gray-500">{plan.calories} calories</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="text-3xl font-bold mb-6">
                    {Math.round(plan.price * 1.4)} <span className="text-sm font-normal text-gray-500">MAD/week</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span className="text-sm">{feature === "5 days per week" ? "7 days per week" : feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Select Plan</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 rounded-xl p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Customize Your Plan</h2>
          <p className="text-gray-600">
            Need something more specific? We offer customization options to meet your unique needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="font-semibold mb-2">Dietary Restrictions</h3>
            <p className="text-gray-600 mb-4">
              Vegetarian, vegan, gluten-free, dairy-free, and other dietary options available.
            </p>
            <Button variant="outline" className="w-full">
              Select Options
            </Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="font-semibold mb-2">Meal Frequency</h3>
            <p className="text-gray-600 mb-4">
              Choose between 2, 3, or 5 meals per day based on your lifestyle and goals.
            </p>
            <Button variant="outline" className="w-full">
              Select Options
            </Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="font-semibold mb-2">Calorie Adjustments</h3>
            <p className="text-gray-600 mb-4">
              Fine-tune your calorie intake based on your specific needs and activity level.
            </p>
            <Button variant="outline" className="w-full">
              Select Options
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Not Sure Which Plan Is Right For You?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Our nutrition experts can help you choose the perfect meal plan based on your goals, preferences, and
          lifestyle.
        </p>
        <Button size="lg" className="bg-green-600 hover:bg-green-700">
          Schedule a Free Consultation
        </Button>
      </div>
    </div>
  )
}
