"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function InitSubscriptionPlansPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: any
    error?: string
  } | null>(null)

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
              sample meals. The system will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Find existing meal plan products</li>
                <li>Create subscription plan templates</li>
                <li>Link sample meals to each plan</li>
                <li>Set up pricing and delivery schedules</li>
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={initializePlans} disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Initialize Subscription Plans
            </Button>

            {result && (
              <Alert className={result.success ? "border-green-500" : "border-red-500"}>
                <div className="flex items-start">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  )}
                  <AlertDescription className="ml-2">
                    <div className="font-medium">{result.message}</div>
                    {result.details && (
                      <div className="mt-2 space-y-1 text-sm">
                        <div>Plans created: {result.details.plansCreated}</div>
                        <div>Plan items created: {result.details.itemsCreated}</div>
                        <div>Meal plan products found: {result.details.mealPlanProducts}</div>
                        <div>Sample meals available: {result.details.sampleMeals}</div>
                        {result.details.priceColumnUsed && (
                          <div>Price column used: {result.details.priceColumnUsed}</div>
                        )}
                      </div>
                    )}
                    {result.error && (
                      <div className="mt-2 text-sm text-red-600">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
