"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { saveMealPreferences } from "./actions"
import type { MealPreferences } from "./types"

export default function MealCustomizationClient() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState("weight_loss")
  const [calorieRange, setCalorieRange] = useState([1500])
  const [mealFrequency, setMealFrequency] = useState("3")
  const [daysPerWeek, setDaysPerWeek] = useState("5")
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [allergies, setAllergies] = useState<string[]>([])
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([])
  const [newExcludedIngredient, setNewExcludedIngredient] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dietaryOptions = [
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "pescatarian", label: "Pescatarian" },
    { value: "gluten_free", label: "Gluten Free" },
    { value: "dairy_free", label: "Dairy Free" },
    { value: "low_carb", label: "Low Carb" },
    { value: "high_protein", label: "High Protein" },
  ]

  const allergyOptions = [
    { value: "nuts", label: "Nuts" },
    { value: "shellfish", label: "Shellfish" },
    { value: "eggs", label: "Eggs" },
    { value: "soy", label: "Soy" },
    { value: "wheat", label: "Wheat" },
    { value: "fish", label: "Fish" },
    { value: "dairy", label: "Dairy" },
  ]

  const toggleDietaryPreference = (value: string) => {
    if (dietaryPreferences.includes(value)) {
      setDietaryPreferences(dietaryPreferences.filter((item) => item !== value))
    } else {
      setDietaryPreferences([...dietaryPreferences, value])
    }
  }

  const toggleAllergy = (value: string) => {
    if (allergies.includes(value)) {
      setAllergies(allergies.filter((item) => item !== value))
    } else {
      setAllergies([...allergies, value])
    }
  }

  const addExcludedIngredient = () => {
    if (newExcludedIngredient.trim() && !excludedIngredients.includes(newExcludedIngredient.trim())) {
      setExcludedIngredients([...excludedIngredients, newExcludedIngredient.trim()])
      setNewExcludedIngredient("")
    }
  }

  const removeExcludedIngredient = (ingredient: string) => {
    setExcludedIngredients(excludedIngredients.filter((item) => item !== ingredient))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const preferences: MealPreferences = {
        planType: selectedPlan,
        calorieTarget: calorieRange[0],
        mealsPerDay: Number.parseInt(mealFrequency),
        daysPerWeek: Number.parseInt(daysPerWeek),
        dietaryPreferences,
        allergies,
        excludedIngredients,
      }

      const result = await saveMealPreferences(preferences)

      // If this is a guest user, store preferences in localStorage
      if (result.isGuest && result.preferences) {
        localStorage.setItem("meal_preferences", JSON.stringify(result.preferences))
      }

      router.push("/meal-plans/preview")
    } catch (error) {
      console.error("Error saving preferences:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Customize Your Meal Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tailor your meal plan to your specific needs and preferences. Our chefs will prepare meals that match your
          requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Selection</CardTitle>
              <CardDescription>Choose your base meal plan</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="weight_loss" onValueChange={setSelectedPlan} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                  <TabsTrigger value="weight_loss">Weight Loss</TabsTrigger>
                  <TabsTrigger value="balanced">Balanced</TabsTrigger>
                  <TabsTrigger value="muscle_gain">Muscle Gain</TabsTrigger>
                  <TabsTrigger value="keto">Keto</TabsTrigger>
                </TabsList>

                <TabsContent value="weight_loss">
                  <div className="space-y-4">
                    <h3 className="font-medium">Weight Loss Plan</h3>
                    <p className="text-sm text-gray-600">
                      Designed to help you lose weight while maintaining energy and satisfaction. Calorie-controlled
                      portions with high protein content to keep you full.
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge>1200-1500 calories</Badge>
                      <Badge variant="outline">High Protein</Badge>
                      <Badge variant="outline">Low Carb</Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="balanced">
                  <div className="space-y-4">
                    <h3 className="font-medium">Balanced Nutrition Plan</h3>
                    <p className="text-sm text-gray-600">
                      Perfect for maintaining a healthy lifestyle with balanced macronutrients. Ideal for those looking
                      to maintain weight and energy levels.
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge>1800-2000 calories</Badge>
                      <Badge variant="outline">Balanced Macros</Badge>
                      <Badge variant="outline">Nutrient Dense</Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="muscle_gain">
                  <div className="space-y-4">
                    <h3 className="font-medium">Muscle Gain Plan</h3>
                    <p className="text-sm text-gray-600">
                      High protein meals to support muscle growth and recovery after workouts. Includes complex
                      carbohydrates for sustained energy.
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge>2500-2800 calories</Badge>
                      <Badge variant="outline">High Protein</Badge>
                      <Badge variant="outline">Performance</Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="keto">
                  <div className="space-y-4">
                    <h3 className="font-medium">Keto Plan</h3>
                    <p className="text-sm text-gray-600">
                      Low-carb, high-fat meals designed to keep you in ketosis. Helps with fat loss while maintaining
                      muscle mass.
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge>1600-1800 calories</Badge>
                      <Badge variant="outline">Low Carb</Badge>
                      <Badge variant="outline">High Fat</Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dietary Preferences</CardTitle>
              <CardDescription>Select any dietary preferences you follow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dietaryOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={dietaryPreferences.includes(option.value) ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => toggleDietaryPreference(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
              <CardDescription>Select any food allergies you have</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allergyOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={allergies.includes(option.value) ? "destructive" : "outline"}
                    className="justify-start"
                    onClick={() => toggleAllergy(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Excluded Ingredients</CardTitle>
              <CardDescription>Add any ingredients you want to exclude from your meals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter ingredient to exclude"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newExcludedIngredient}
                    onChange={(e) => setNewExcludedIngredient(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addExcludedIngredient()
                      }
                    }}
                  />
                  <Button onClick={addExcludedIngredient}>Add</Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {excludedIngredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                      {ingredient}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeExcludedIngredient(ingredient)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>Your Plan Summary</CardTitle>
                <CardDescription>Review your customized meal plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Plan Type:</span>
                    <span className="text-sm font-medium capitalize">{selectedPlan.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Calories:</span>
                    <span className="text-sm font-medium">{calorieRange[0]} per day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Meals per day:</span>
                    <span className="text-sm font-medium">{mealFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Days per week:</span>
                    <span className="text-sm font-medium">{daysPerWeek}</span>
                  </div>
                </div>

                {dietaryPreferences.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm text-gray-600">Dietary Preferences:</span>
                    <div className="flex flex-wrap gap-1">
                      {dietaryPreferences.map((pref) => (
                        <Badge key={pref} variant="outline" className="text-xs">
                          {dietaryOptions.find((opt) => opt.value === pref)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {allergies.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm text-gray-600">Allergies:</span>
                    <div className="flex flex-wrap gap-1">
                      {allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive" className="text-xs">
                          {allergyOptions.find((opt) => opt.value === allergy)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {excludedIngredients.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm text-gray-600">Excluded Ingredients:</span>
                    <div className="flex flex-wrap gap-1">
                      {excludedIngredients.map((ingredient) => (
                        <Badge key={ingredient} variant="secondary" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Continue to Preview"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
