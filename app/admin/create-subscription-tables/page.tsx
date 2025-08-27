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
              This will create the necessary database tables for the subscription system:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>subscription_plans - Defines subscription plan templates</li>
                <li>subscription_plan_items - Links products to subscription plans</li>
                <li>active_subscriptions - Tracks customer subscriptions</li>
                <li>deliveries - Manages delivery scheduling and tracking</li>
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={createTables} disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Subscription Tables
            </Button>

            {result && (
              <Alert className={result.success ? "border-green-500" : "border-red-500"}>
                <div className="flex items-center">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <AlertDescription className="ml-2">
                    <div className="font-medium">{result.message}</div>
                    {result.tables && (
                      <div className="mt-2">
                        <strong>Created tables:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {result.tables.map((table) => (
                            <li key={table}>{table}</li>
                          ))}
                        </ul>
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
