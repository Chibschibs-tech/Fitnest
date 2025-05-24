"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DeploymentTestPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/deployment-diagnostic")
      const data = await response.json()
      setDiagnostics(data)
    } catch (error) {
      console.error("Diagnostics failed:", error)
      setDiagnostics({ error: "Failed to run diagnostics" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Deployment Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runDiagnostics} disabled={loading} className="mb-4">
            {loading ? "Running..." : "Run Diagnostics"}
          </Button>

          {diagnostics && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Status: {diagnostics.status}</h3>
                <p className="text-sm text-gray-600">Auth System: {diagnostics.authSystem}</p>
              </div>

              {diagnostics.environment && (
                <div>
                  <h4 className="font-medium">Environment:</h4>
                  <ul className="text-sm">
                    {Object.entries(diagnostics.environment).map(([key, value]) => (
                      <li key={key}>
                        {key}: {value as string}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {diagnostics.dependencies && (
                <div>
                  <h4 className="font-medium">Dependencies:</h4>
                  <ul className="text-sm">
                    {Object.entries(diagnostics.dependencies).map(([key, value]) => (
                      <li key={key}>
                        {key}: {value as string}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {diagnostics.error && <div className="text-red-600">Error: {diagnostics.error}</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
