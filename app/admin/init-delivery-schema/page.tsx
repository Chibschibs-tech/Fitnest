"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function InitDeliverySchemaPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const initializeSchema = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/init-delivery-schema", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, message: data.error || "Failed to initialize schema" })
      }
    } catch (error) {
      setResult({ success: false, message: "Network error occurred" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Initialize Delivery Schema</CardTitle>
          <CardDescription>
            Set up the database schema for delivery tracking and pause/resume functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">This will create:</h3>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Add pause-related columns to orders table</li>
              <li>• Create deliveries table for tracking individual deliveries</li>
              <li>• Create necessary indexes for performance</li>
            </ul>
          </div>

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

          <Button onClick={initializeSchema} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing Schema...
              </>
            ) : (
              "Initialize Delivery Schema"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
