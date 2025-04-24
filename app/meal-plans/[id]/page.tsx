import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, Clock, Flame, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define meal plan data
const mealPlans = {
  "weight-loss": {
    title: "Weight Loss Meal Plan",
    description:
      "Our Weight Loss meal plan is designed to help you achieve your weight goals without sacrificing taste or satisfaction. Each meal is carefully portioned and nutritionally balanced to support healthy, sustainable weight loss.",
    calories: "1200-1500 calories per day",
    price: "Starting from 140 MAD/week",
    features: [
      "High protein, low carb meals",
      "Calorie-controlled portions",
      "Nutrient-dense ingredients",
      "Satisfying and filling options",
    ],
    benefits: [
      "Supports gradual, sustainable weight loss",
      "Helps maintain muscle mass while losing fat",
      "Keeps you feeling full and satisfied",
      "Provides steady energy throughout the day",
    ],
    idealFor: [
      "Those looking to lose weight in a healthy way",
      "People who want structure in their diet",
      "Individuals with busy lifestyles who don't have time to count calories",
      "Anyone looking to establish healthier eating habits",
    ],
    sampleMeals: [
      {
        type: "Breakfast",
        name: "Greek Yogurt Parfait",
        description: "Greek yogurt with berries, honey, and a sprinkle of granola",
        calories: 320,
        protein: 22,
        carbs: 30,
        fat: 12,
        image: "/layered-berry-parfait.png",
      },
      {
        type: "Lunch",
        name: "Grilled Chicken Salad",
        description: "Grilled chicken breast over mixed greens with light vinaigrette",
        calories: 380,
        protein: 35,
        carbs: 15,
        fat: 18,
        image: "/grilled-chicken-vegetable-medley.png",
      },
      {
        type: "Dinner",
        name: "Baked Salmon with Vegetables",
        description: "Herb-seasoned salmon fillet with roasted vegetables",
        calories: 420,
        protein: 32,
        carbs: 20,
        fat: 22,
        image: "/pan-seared-salmon-quinoa.png",
      },
    ],
    image: "/vibrant-weight-loss-meal.png",
    color: "#22c55e",
  },
  "balanced-nutrition": {
    title: "Balanced Nutrition Meal Plan",
    description:
      "Our Balanced Nutrition plan provides well-rounded meals with optimal proportions of proteins, carbs, and healthy fats. Perfect for maintaining a healthy lifestyle with delicious, nutrient-rich foods.",
    calories: "1800-2000 calories per day",
    price: "Starting from 160 MAD/week",
    features: [
      "Balanced macronutrients",
      "Variety of ingredients",
      "Rich in vitamins and minerals",
      "Sustainable eating pattern",
    ],
    benefits: [
      "Supports overall health and wellbeing",
      "Provides consistent energy levels",
      "Helps maintain current weight",
      "Supports immune function and recovery",
    ],
    idealFor: [
      "Those looking to maintain their current weight",
      "People seeking a sustainable, long-term eating pattern",
      "Active individuals who need balanced nutrition",
      "Anyone wanting to improve their overall diet quality",
    ],
    sampleMeals: [
      {
        type: "Breakfast",
        name: "Avocado Toast with Egg",
        description: "Whole grain toast with avocado, poached egg, and microgreens",
        calories: 420,
        protein: 18,
        carbs: 35,
        fat: 22,
        image: "/fluffy-protein-stack.png",
      },
      {
        type: "Lunch",
        name: "Quinoa Bowl",
        description: "Quinoa with roasted vegetables, chickpeas, and tahini dressing",
        calories: 520,
        protein: 20,
        carbs: 65,
        fat: 18,
        image: "/rainbow-grain-bowl.png",
      },
      {
        type: "Dinner",
        name: "Turkey Meatballs with Sweet Potato",
        description: "Lean turkey meatballs with roasted sweet potato and green beans",
        calories: 580,
        protein: 35,
        carbs: 45,
        fat: 22,
        image: "/savory-turkey-meatballs.png",
      },
    ],
    image: "/vibrant-nutrition-plate.png",
    color: "#3b82f6",
  },
  "muscle-gain": {
    title: "Muscle Gain Meal Plan",
    description:
      "Our Muscle Gain plan is protein-rich and calorie-dense to support muscle growth and recovery. Ideal for those looking to build lean muscle mass alongside their training regimen.",
    calories: "2500-2800 calories per day",
    price: "Starting from 180 MAD/week",
    features: [
      "High protein content",
      "Complex carbohydrates",
      "Performance-focused nutrition",
      "Recovery-enhancing ingredients",
    ],
    benefits: [
      "Supports muscle growth and recovery",
      "Provides energy for intense workouts",
      "Helps achieve caloric surplus needed for gains",
      "Optimizes protein timing throughout the day",
    ],
    idealFor: [
      "Athletes and bodybuilders",
      "Those looking to increase muscle mass",
      "People with high activity levels",
      "Individuals who struggle to consume enough calories",
    ],
    sampleMeals: [
      {
        type: "Breakfast",
        name: "Protein Pancakes",
        description: "Protein-packed pancakes with banana, walnuts, and maple syrup",
        calories: 650,
        protein: 40,
        carbs: 70,
        fat: 20,
        image: "/fluffy-protein-stack.png",
      },
      {
        type: "Lunch",
        name: "Chicken Power Bowl",
        description: "Grilled chicken with brown rice, black beans, and avocado",
        calories: 720,
        protein: 45,
        carbs: 80,
        fat: 22,
        image: "/chicken-quinoa-power-bowl.png",
      },
      {
        type: "Dinner",
        name: "Steak with Sweet Potato",
        description: "Lean steak with roasted sweet potato and steamed broccoli",
        calories: 780,
        protein: 50,
        carbs: 60,
        fat: 30,
        image: "/hearty-muscle-meal.png",
      },
    ],
    image: "/hearty-muscle-meal.png",
    color: "#8b5cf6",
  },
  keto: {
    title: "Keto Meal Plan",
    description:
      "Our Keto plan features low-carb, high-fat meals designed to help your body reach and maintain ketosis. Perfect for those following a ketogenic lifestyle for weight management or metabolic health.",
    calories: "1600-1800 calories per day",
    price: "Starting from 170 MAD/week",
    features: [
      "Low carb, high fat",
      "Moderate protein",
      "Ketogenic-friendly ingredients",
      "Satisfying fat-adapted meals",
    ],
    benefits: [
      "Supports fat adaptation and ketosis",
      "May help with appetite control",
      "Provides steady energy without crashes",
      "Can support certain weight loss goals",
    ],
    idealFor: [
      "Those following a ketogenic diet",
      "People looking for low-carb meal options",
      "Individuals seeking to improve metabolic health",
      "Anyone wanting to reduce carb intake while enjoying satisfying meals",
    ],
    sampleMeals: [
      {
        type: "Breakfast",
        name: "Avocado and Bacon Eggs",
        description: "Scrambled eggs with avocado, bacon, and cheddar cheese",
        calories: 520,
        protein: 25,
        carbs: 5,
        fat: 45,
        image: "/fluffy-protein-stack.png",
      },
      {
        type: "Lunch",
        name: "Salmon Avocado Plate",
        description: "Baked salmon with avocado, mixed greens, and olive oil dressing",
        calories: 580,
        protein: 30,
        carbs: 8,
        fat: 48,
        image: "/pan-seared-salmon-quinoa.png",
      },
      {
        type: "Dinner",
        name: "Cauliflower Steak",
        description: "Cauliflower steak with herb butter, asparagus, and grilled halloumi",
        calories: 620,
        protein: 22,
        carbs: 10,
        fat: 52,
        image: "/colorful-keto-plate.png",
      },
    ],
    image: "/colorful-keto-plate.png",
    color: "#f97316",
  },
}

export default function MealPlanPage({ params }: { params: { id: string } }) {
  const plan = mealPlans[params.id as keyof typeof mealPlans]

  if (!plan) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <Link href="/meal-plans" className="flex items-center text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to All Meal Plans
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{plan.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{plan.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Flame className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-medium mb-1">Calorie Range</h3>
                <p className="text-sm text-gray-600">{plan.calories}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Clock className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-medium mb-1">Meal Frequency</h3>
                <p className="text-sm text-gray-600">2-4 meals per day</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Utensils className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-medium mb-1">Pricing</h3>
                <p className="text-sm text-gray-600">{plan.price}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="features" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="ideal-for">Ideal For</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="p-4 border rounded-md mt-2">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="benefits" className="p-4 border rounded-md mt-2">
              <ul className="space-y-2">
                {plan.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="ideal-for" className="p-4 border rounded-md mt-2">
              <ul className="space-y-2">
                {plan.idealFor.map((ideal, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{ideal}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>

          <h2 className="text-2xl font-bold mb-4">Sample Meals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {plan.sampleMeals.map((meal, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={meal.image || "/placeholder.svg"}
                    alt={meal.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {meal.type}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{meal.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <p className="font-medium">{meal.calories}</p>
                      <p className="text-gray-500">Cal</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{meal.protein}g</p>
                      <p className="text-gray-500">Protein</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{meal.carbs}g</p>
                      <p className="text-gray-500">Carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{meal.fat}g</p>
                      <p className="text-gray-500">Fat</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={plan.image || "/placeholder.svg"}
                  alt={plan.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Ready to get started?</h3>
                <p className="text-gray-600 mb-6">
                  Customize your {plan.title.toLowerCase()} and start enjoying delicious, nutritious meals delivered to
                  your door.
                </p>
                <Link href="/order">
                  <Button className="w-full bg-green-600 hover:bg-green-700 mb-3">Order Now</Button>
                </Link>
                <p className="text-xs text-center text-gray-500">No commitment. Cancel or pause anytime.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-8 md:p-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Have questions about our {plan.title.toLowerCase()}?</h2>
          <p className="text-gray-600 mb-6">
            Our nutrition experts are here to help you choose the right plan and customize it to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" size="lg">
                View FAQs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
