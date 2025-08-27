"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database } from "lucide-react"

export default function CreatePricingTablesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const createTables = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/admin/create-pricing-tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create tables")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Pricing Tables</h1>
          <p className="text-gray-600 mt-2">Set up the dynamic pricing engine tables and seed data</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Pricing Engine Setup
            </CardTitle>
            <CardDescription>This will create the necessary tables for the dynamic pricing system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Tables to be created:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>
                    <code>meal_type_prices</code> - Base prices for each plan and meal type
                  </li>
                  <li>
                    <code>discount_rules</code> - Discount rules based on days/week and duration
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Seed data includes:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>9 meal prices (3 plans × 3 meal types)</li>
                  <li>7 discount rules (days per week + duration discounts)</li>
                  <li>Indexes for optimal performance</li>
                  <li>Auto-update triggers for timestamps</li>
                </ul>
              </div>

              <Button onClick={createTables} disabled={isLoading} className="w-full">
                {isLoading ? "Creating Tables..." : "Create Pricing Tables"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">✅ {result.message}</p>
                <div className="text-sm">
                  <p>
                    <strong>Tables created:</strong> {result.tables?.join(", ")}
                  </p>
                  <p>
                    <strong>Meal prices seeded:</strong> {result.seedData?.mealPrices}
                  </p>
                  <p>
                    <strong>Discount rules seeded:</strong> {result.seedData?.discountRules}
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>🎉 Success! Next Steps:</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Visit{" "}
                  <a href="/admin/pricing" className="text-blue-600 hover:underline">
                    /admin/pricing
                  </a>{" "}
                  to manage prices and discounts
                </li>
                <li>
                  Test the pricing API at <code>/api/calculate-price</code>
                </li>
                <li>Use the price simulator in the admin panel</li>
                <li>Integrate with your existing subscription system</li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
