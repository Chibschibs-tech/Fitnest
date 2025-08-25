"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function InitSubscriptionPlansPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; plans?: any[] } | null>(null)

  const initializePlans = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/init-subscription-plans", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Initialize Subscription Plans</h1>
        <p className="text-gray-600">Create subscription plans based on your existing meal plan products.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>What This Will Create</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Subscription Plans:</h3>
                <ul className="text-sm space-y-1">
                  <li>• Stay Fit Plan (299 MAD/week)</li>
                  <li>• Weight Loss Plan (299 MAD/week)</li>
                  <li>• Muscle Gain Plan (399 MAD/week)</li>
                  <li>• Keto Plan (349 MAD/week)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Plan Contents:</h3>
                <ul className="text-sm space-y-1">
                  <li>• 3 main meals per delivery</li>
                  <li>• Optional breakfast items</li>
                  <li>• Optional snack add-ons</li>
                  <li>• Weekly delivery schedule</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Initialize Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              This will create subscription plans based on your existing meal plan products and populate them with
              sample meals.
            </p>

            <Button onClick={initializePlans} disabled={loading} className="w-full">
              {loading ? (
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
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                  {result.message}
                </AlertDescription>
              </Alert>
            )}

            {result?.success && result.plans && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Created Plans:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {result.plans.map((plan: any) => (
                    <li key={plan.id}>• {plan.name}</li>
                  ))}
                </ul>
                <p className="text-sm text-blue-800 mt-3">
                  <strong>Next step:</strong> Visit the subscription plans management page to view and edit your plans.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
