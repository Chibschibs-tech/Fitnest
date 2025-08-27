"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Info } from "lucide-react"

interface InitResult {
  success: boolean
  message: string
  details?: {
    plansCreated: number
    itemsCreated: number
    mealPlanProducts: number
    sampleMeals: number
    priceColumnUsed: string
    availableColumns: string[]
  }
  error?: string
  missingTables?: string[]
}

export default function InitSubscriptionPlansPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<InitResult | null>(null)

  const initializePlans = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/init-subscription-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to initialize subscription plans",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Initialize Subscription Plans</CardTitle>
            <CardDescription>
              This will create subscription plans based on your existing meal plan products and populate them with
              sample meals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <div className="font-semibold">What this will do:</div>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Find existing meal plan products in your database</li>
                  <li>Create subscription plans for each meal plan</li>
                  <li>Link sample meals to each subscription plan</li>
                  <li>Set up proper pricing and delivery schedules</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button onClick={initializePlans} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing Plans...
                </>
              ) : (
                "Initialize Subscription Plans"
              )}
            </Button>

            {result && (
              <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <div className="flex items-start">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  )}
                  <AlertDescription className="ml-2">
                    <div className="font-semibold">{result.message}</div>

                    {result.details && (
                      <div className="mt-3 space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Plans Created: {result.details.plansCreated}</div>
                          <div>Items Created: {result.details.itemsCreated}</div>
                          <div>Meal Products: {result.details.mealPlanProducts}</div>
                          <div>Sample Meals: {result.details.sampleMeals}</div>
                        </div>
                        <div className="text-sm">
                          <div className="font-semibold">Price Column Used: {result.details.priceColumnUsed}</div>
                          <div className="text-xs text-gray-600">
                            Available columns: {result.details.availableColumns.join(", ")}
                          </div>
                        </div>
                      </div>
                    )}

                    {result.missingTables && (
                      <div className="mt-2 text-sm text-red-600">Missing tables: {result.missingTables.join(", ")}</div>
                    )}

                    {result.error && <div className="mt-2 text-sm text-red-600">Error: {result.error}</div>}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {result?.success && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Success! Next Steps:</h4>
                <ol className="list-decimal list-inside text-sm text-green-800 mt-2 space-y-1">
                  <li>Visit "Subscription Plans" to view and manage your plans</li>
                  <li>Edit plan contents and add more meals as needed</li>
                  <li>Test the subscription system with your order flow</li>
                  <li>Configure pricing and delivery schedules</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
