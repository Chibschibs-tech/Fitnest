"use client"

import { useState } from "react"
import { siteConfig } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ApiTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [result, setResult] = useState<any>(null)

  const testConnection = async () => {
    setStatus("loading")
    try {
      // Test both relative and absolute URLs
      const relativeResponse = await fetch("/api/test-connection")
      const relativeData = await relativeResponse.json()

      const absoluteResponse = await fetch(`${siteConfig.apiUrl}/api/test-connection`)
      const absoluteData = await absoluteResponse.json()

      setResult({
        relative: {
          status: relativeResponse.status,
          data: relativeData,
        },
        absolute: {
          status: absoluteResponse.status,
          data: absoluteData,
        },
      })
      setStatus("success")
    } catch (error) {
      console.error("API test error:", error)
      setResult({ error: error.message })
      setStatus("error")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">API URL:</p>
              <p className="text-sm text-gray-500">{siteConfig.apiUrl}</p>
            </div>
            <Button onClick={testConnection} disabled={status === "loading"} variant="outline">
              {status === "loading" ? "Testing..." : "Test Connection"}
            </Button>
          </div>

          {status === "success" && (
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-800 font-medium">Connection successful!</p>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-800 font-medium">Connection failed</p>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
