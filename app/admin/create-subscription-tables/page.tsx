"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function CreateSubscriptionTablesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const createTables = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/create-subscription-tables", {
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
        <h1 className="text-3xl font-bold mb-2">Create Subscription Tables</h1>
        <p className="text-gray-600">Set up the database tables needed for the subscription system.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Tables to Create</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Core Tables:</h3>
                <ul className="text-sm space-y-1">
                  <li>• subscription_plans</li>
                  <li>• subscription_plan_items</li>
                  <li>• active_subscriptions</li>
                  <li>• deliveries</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="text-sm space-y-1">
                  <li>• Plan management</li>
                  <li>• Customer subscriptions</li>
                  <li>• Delivery scheduling</li>
                  <li>• Performance indexes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Tables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              This will create the necessary database tables for the subscription system. Safe to run multiple times.
            </p>

            <Button onClick={createTables} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Tables...
                </>
              ) : (
                "Create Subscription Tables"
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

            {result?.success && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next step:</strong> Now you can initialize the subscription plans with your meal data.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
