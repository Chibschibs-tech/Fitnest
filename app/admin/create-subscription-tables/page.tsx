"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function CreateSubscriptionTablesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    tables?: string[]
    error?: string
  } | null>(null)

  const createTables = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/create-subscription-tables", {
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
        message: "Failed to create tables",
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
            <CardTitle>Create Subscription Tables</CardTitle>
            <CardDescription>
              This will create the necessary database tables for the subscription system: subscription_plans,
              subscription_plan_items, active_subscriptions, and deliveries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Tables to be created:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>subscription_plans - Defines available subscription plans</li>
                <li>subscription_plan_items - Links products to subscription plans</li>
                <li>active_subscriptions - Tracks customer subscriptions</li>
                <li>deliveries - Manages delivery scheduling and tracking</li>
              </ul>
            </div>

            <Button onClick={createTables} disabled={isLoading} className="w-full">
              {isLoading ? (
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
                <div className="flex items-center">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className="ml-2">
                    <div className="font-semibold">{result.message}</div>
                    {result.tables && (
                      <div className="mt-2">
                        <div className="text-sm">Created tables:</div>
                        <ul className="list-disc list-inside text-sm">
                          {result.tables.map((table) => (
                            <li key={table}>{table}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.error && <div className="mt-2 text-sm text-red-600">Error: {result.error}</div>}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {result?.success && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Next Steps:</h4>
                <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-1">
                  <li>Visit the "Initialize Subscription Plans" page to populate with data</li>
                  <li>Go to "Subscription Plans" to manage your plans</li>
                  <li>Test the subscription system with your meal plans</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
