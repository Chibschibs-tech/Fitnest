"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, AlertTriangle } from "lucide-react"

export default function InitDeliverySchemaPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatingDeliveries, setGeneratingDeliveries] = useState(false)
  const [deliveriesSuccess, setDeliveriesSuccess] = useState<string | null>(null)
  const [deliveriesError, setDeliveriesError] = useState<string | null>(null)

  const initSchema = async () => {
    setLoading(true)
    setSuccess(null)
    setError(null)

    try {
      const response = await fetch("/api/init-delivery-schema")
      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
      } else {
        setError(data.message || "Failed to initialize schema")
      }
    } catch (err) {
      setError("An error occurred while initializing the schema")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generateTestDeliveries = async () => {
    setGeneratingDeliveries(true)
    setDeliveriesSuccess(null)
    setDeliveriesError(null)

    try {
      // Get all orders with plan_id
      const ordersResponse = await fetch("/api/admin/orders")
      const ordersData = await ordersResponse.json()

      if (!ordersData.orders || !Array.isArray(ordersData.orders)) {
        throw new Error("Failed to fetch orders")
      }

      const planOrders = ordersData.orders.filter((order: any) => order.plan_id)

      if (planOrders.length === 0) {
        setDeliveriesError("No plan orders found to generate deliveries for")
        return
      }

      // Generate deliveries for each order
      let successCount = 0
      for (const order of planOrders) {
        try {
          // Check if deliveries already exist
          const checkResponse = await fetch(`/api/subscriptions/${order.id}/deliveries`)
          const checkData = await checkResponse.json()

          if (checkData.deliveries && checkData.deliveries.length > 0) {
            continue // Skip if deliveries already exist
          }

          // Generate deliveries starting from today
          const startDate = new Date()

          // Use the DeliveryService directly
          await fetch("/api/admin/generate-deliveries", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: order.id,
              startDate: startDate.toISOString(),
              totalWeeks: 4,
            }),
          })

          successCount++
        } catch (err) {
          console.error(`Error generating deliveries for order ${order.id}:`, err)
        }
      }

      setDeliveriesSuccess(`Successfully generated deliveries for ${successCount} orders`)
    } catch (err) {
      setDeliveriesError("An error occurred while generating test deliveries")
      console.error(err)
    } finally {
      setGeneratingDeliveries(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Delivery System Setup</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Initialize Delivery Schema</CardTitle>
            <CardDescription>
              Create the necessary database tables and columns for the delivery and pause system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-gray-600 mb-4">
              This will create the deliveries table and add pause-related columns to the orders table. It's safe to run
              multiple times as it checks if the tables/columns already exist.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={initSchema} disabled={loading}>
              {loading ? "Initializing..." : "Initialize Schema"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Generate Test Deliveries</CardTitle>
            <CardDescription>Create delivery schedules for existing subscription orders</CardDescription>
          </CardHeader>
          <CardContent>
            {deliveriesSuccess && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{deliveriesSuccess}</AlertDescription>
              </Alert>
            )}

            {deliveriesError && (
              <Alert className="mb-4" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{deliveriesError}</AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-gray-600 mb-4">
              This will generate delivery schedules for all existing subscription orders. It will skip orders that
              already have deliveries.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={generateTestDeliveries} disabled={generatingDeliveries}>
              {generatingDeliveries ? "Generating..." : "Generate Test Deliveries"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
