import { MealPlanPreview } from "@/components/meal-plan-preview"
import { getMealPreferencesFromCookie } from "@/app/meal-customization/actions"

// Define meal plan data
const mealPlans = [
  {
    id: "weight-loss",
    title: "Weight Loss",
    description: "Designed to help you lose weight while maintaining energy and satisfaction.",
    calories: "1200-1500 calories per day",
    price: "Starting from 140 MAD/week",
    features: [
      "High protein, low carb meals",
      "Calorie-controlled portions",
      "Nutrient-dense ingredients",
      "Satisfying and filling options",
    ],
    image: "/vibrant-weight-loss-meal.png",
    color: "green",
  },
  {
    id: "balanced-nutrition",
    title: "Stay Fit",
    description: "Perfect for maintaining a healthy lifestyle with well-rounded nutrition.",
    calories: "1600-1900 calories per day",
    price: "Starting from 160 MAD/week",
    features: [
      "Balanced macronutrients",
      "Variety of ingredients",
      "Rich in vitamins and minerals",
      "Sustainable eating pattern",
    ],
    image: "/vibrant-nutrition-plate.png",
    color: "blue",
  },
  {
    id: "muscle-gain",
    title: "Muscle Gain",
    description: "Fuel your workouts and recovery with protein-rich meals for muscle growth.",
    calories: "2200-2500 calories per day",
    price: "Starting from 180 MAD/week",
    features: [
      "High protein content",
      "Complex carbohydrates",
      "Performance-focused nutrition",
      "Recovery-enhancing ingredients",
    ],
    image: "/hearty-muscle-meal.png",
    color: "purple",
  },
  {
    id: "keto",
    title: "Keto",
    description: "Low-carb, high-fat meals designed to help your body reach and maintain ketosis.",
    calories: "1700-1900 calories per day",
    price: "Starting from 170 MAD/week",
    features: [
      "Low carb, high fat",
      "Moderate protein",
      "Ketogenic-friendly ingredients",
      "Satisfying fat-adapted meals",
    ],
    image: "/colorful-keto-plate.png",
    color: "orange",
  },
]

export const dynamic = "force-dynamic"

export async function generateMetadata() {
  const preferences = await getMealPreferencesFromCookie()
  return {
    title: preferences ? "Meal Plan Preview" : "No Meal Plan",
  }
}

export default async function Page() {
  const preferences = await getMealPreferencesFromCookie()

  return <MealPlanPreview preferences={preferences} />
}
