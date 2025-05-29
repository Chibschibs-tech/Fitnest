"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import type { MealPreferences } from "@/app/meal-customization/types"

interface MealPlanPreviewProps {
  preferences: MealPreferences
}

export function MealPlanPreview({ preferences }: MealPlanPreviewProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = () => {
    setIsLoading(true)
    // Store in localStorage for checkout
    localStorage.setItem(
      "selectedMealPlan",
      JSON.stringify({
        id: preferences.planType,
        name: getPlanName(preferences.planType),
        price: calculatePrice(preferences),
        mealsPerWeek: preferences.mealsPerDay * preferences.daysPerWeek,
        duration: "4 weeks",
      }),
    )

    // Store customizations separately
    localStorage.setItem(
      "mealPlanCustomizations",
      JSON.stringify({
        dietaryRestrictions: preferences.dietaryPreferences,
        allergies: preferences.allergies,
        excludedIngredients: preferences.excludedIngredients,
      }),
    )

    router.push("/checkout")
  }

  const getPlanName = (planType: string): string => {
    const planNames: Record<string, string> = {
      weight_loss: "Weight Loss Plan",
      balanced: "Balanced Nutrition Plan",
      muscle_gain: "Muscle Gain Plan",
      keto: "Keto Plan",
    }
    return planNames[planType] || "Custom Plan"
  }

  const calculatePrice = (prefs: MealPreferences): number => {
    // Base price per meal
    const basePricePerMeal = 45 // MAD

    // Calculate weekly meals
    const weeklyMeals = prefs.mealsPerDay * prefs.daysPerWeek

    // Calculate monthly price (4 weeks)
    const monthlyPrice = weeklyMeals * basePricePerMeal * 4

    // Apply discounts based on volume
    let discount = 0
    if (weeklyMeals >= 15) {
      discount = 0.15 // 15% discount for 15+ meals per week
    } else if (weeklyMeals >= 10) {
      discount = 0.1 // 10% discount for 10+ meals per week
    } else if (weeklyMeals >= 5) {
      discount = 0.05 // 5% discount for 5+ meals per week
    }

    return Math.round(monthlyPrice * (1 - discount))
  }

  const planName = getPlanName(preferences.planType)
  const price = calculatePrice(preferences)
  const weeklyMeals = preferences.mealsPerDay * preferences.daysPerWeek

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Meal Plan Preview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{planName}</CardTitle>
              <CardDescription>{weeklyMeals} meals per week • 4-week subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Plan Details</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Plan Type:</span>
                    <span className="font-medium">{planName}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Daily Calorie Target:</span>
                    <span className="font-medium">{preferences.calorieTarget} calories</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Meals Per Day:</span>
                    <span className="font-medium">{preferences.mealsPerDay}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Days Per Week:</span>
                    <span className="font-medium">{preferences.daysPerWeek}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Weekly Meals:</span>
                    <span className="font-medium">{weeklyMeals}</span>
                  </li>
                </ul>
              </div>

              {preferences.dietaryPreferences && preferences.dietaryPreferences.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Dietary Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {preferences.dietaryPreferences.map((pref) => (
                      <Badge key={pref} variant="outline">
                        {pref.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {preferences.allergies && preferences.allergies.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {preferences.allergies.map((allergy) => (
                      <Badge key={allergy} variant="destructive">
                        {allergy.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {preferences.excludedIngredients && preferences.excludedIngredients.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Excluded Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {preferences.excludedIngredients.map((ingredient) => (
                      <Badge key={ingredient} variant="secondary">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-green-800">What's Included</h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>✓ Freshly prepared meals delivered to your door</li>
                  <li>✓ Nutritionally balanced meals designed by expert chefs</li>
                  <li>✓ Customized to your dietary preferences and restrictions</li>
                  <li>✓ Convenient packaging that's easy to store and reheat</li>
                  <li>✓ Weekly menu rotation for variety</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Summary</CardTitle>
                <CardDescription>4-week meal plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium">{planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Meals:</span>
                    <span className="font-medium">{weeklyMeals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">4 weeks</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{price.toLocaleString()} MAD</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Billed monthly</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isLoading ? "Processing..." : "Proceed to Checkout"}
                </Button>
                <Button variant="outline" onClick={() => router.push("/meal-customization")} className="w-full">
                  Modify Plan
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
