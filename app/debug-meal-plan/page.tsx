"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugMealPlanPage() {
  const [localStorageData, setLocalStorageData] = useState<any>({})

  useEffect(() => {
    // Check all localStorage keys
    const allKeys = Object.keys(localStorage)
    const data: any = {}

    allKeys.forEach((key) => {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || "null")
      } catch {
        data[key] = localStorage.getItem(key)
      }
    })

    setLocalStorageData(data)
  }, [])

  const addTestMealPlan = () => {
    const testMealPlan = {
      id: "weight-loss",
      planId: "weight-loss",
      name: "Weight Loss Plan",
      planName: "Weight Loss Plan",
      price: 350,
      planPrice: 350,
      duration: "4 weeks",
      mealsPerWeek: 7,
    }

    const testCustomizations = {
      dietaryRestrictions: ["gluten-free"],
      allergies: ["nuts"],
      preferences: ["low-carb"],
    }

    const testDelivery = {
      frequency: "weekly",
      preferredDay: "monday",
      startDate: "2024-01-15",
    }

    localStorage.setItem("selectedMealPlan", JSON.stringify(testMealPlan))
    localStorage.setItem("mealPlanCustomizations", JSON.stringify(testCustomizations))
    localStorage.setItem("mealPlanDelivery", JSON.stringify(testDelivery))

    // Refresh the display
    window.location.reload()
  }

  const clearAllMealPlanData = () => {
    localStorage.removeItem("selectedMealPlan")
    localStorage.removeItem("mealPlanCustomizations")
    localStorage.removeItem("mealPlanDelivery")
    window.location.reload()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Debug Meal Plan Data</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current localStorage Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(localStorageData, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={addTestMealPlan} className="w-full">
              Add Test Meal Plan Data
            </Button>
            <Button onClick={clearAllMealPlanData} variant="outline" className="w-full">
              Clear All Meal Plan Data
            </Button>
            <Button onClick={() => (window.location.href = "/checkout")} variant="secondary" className="w-full">
              Go to Checkout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specific Meal Plan Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>selectedMealPlan:</strong>
                <pre className="bg-gray-100 p-2 rounded text-sm mt-1">
                  {localStorage.getItem("selectedMealPlan") || "Not found"}
                </pre>
              </div>
              <div>
                <strong>mealPlanCustomizations:</strong>
                <pre className="bg-gray-100 p-2 rounded text-sm mt-1">
                  {localStorage.getItem("mealPlanCustomizations") || "Not found"}
                </pre>
              </div>
              <div>
                <strong>mealPlanDelivery:</strong>
                <pre className="bg-gray-100 p-2 rounded text-sm mt-1">
                  {localStorage.getItem("mealPlanDelivery") || "Not found"}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
