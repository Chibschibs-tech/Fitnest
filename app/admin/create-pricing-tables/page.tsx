"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, Play } from "lucide-react"

export default function CreatePricingTablesPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const createTables = async () => {
    setIsCreating(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/admin/create-pricing-tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "Failed to create tables")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Pricing Tables</h1>
          <p className="text-gray-600 mt-2">Initialize the dynamic pricing system database tables</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Setup
            </CardTitle>
            <CardDescription>
              This will create the necessary tables for the dynamic pricing system and populate them with initial data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">What will be created:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>
                    <strong>meal_type_prices</strong> - Stores base prices for each meal type per plan
                  </li>
                  <li>
                    <strong>discount_rules</strong> - Stores discount rules for days/week and duration
                  </li>
                  <li>
                    <strong>Indexes</strong> - Performance optimization indexes
                  </li>
                  <li>
                    <strong>Triggers</strong> - Auto-update timestamps
                  </li>
                  <li>
                    <strong>Seed Data</strong> - 9 meal prices + 7 discount rules
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Button onClick={createTables} disabled={isCreating} className="w-full sm:w-auto">
                  <Play className="h-4 w-4 mr-2" />
                  {isCreating ? "Creating Tables..." : "Create Pricing Tables"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div>
                <strong>✅ Success!</strong> {result.message}
              </div>
              {result.details && (
                <div className="mt-2 text-sm">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Meal prices created: {result.details.mealPricesCreated}</li>
                    <li>Discount rules created: {result.details.discountRulesCreated}</li>
                    <li>Indexes created: {result.details.indexesCreated}</li>
                    <li>Triggers created: {result.details.triggersCreated}</li>
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>❌ Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>✅ Tables created successfully! You can now:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                  <li>
                    Visit <strong>/admin/pricing</strong> to manage prices and discounts
                  </li>
                  <li>
                    Visit <strong>/admin/pricing/test</strong> to run API tests
                  </li>
                  <li>Use the pricing simulator to test calculations</li>
                  <li>Integrate the pricing API with your subscription system</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
