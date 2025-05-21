"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Mail, Key } from "lucide-react"

export default function DeploymentTestPage() {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostic = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/deployment-diagnostic")
      if (!response.ok) {
        throw new Error(`Diagnostic API returned status ${response.status}`)
      }
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostic()
  }, [])

  const getStatusIcon = (status: string) => {
    if (status === "connected" || status === "configured") {
      return <CheckCircle className="h-6 w-6 text-green-500" />
    } else if (status === "error") {
      return <XCircle className="h-6 w-6 text-red-500" />
    } else {
      return <AlertCircle className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Deployment Test</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Connection
            </CardTitle>
            <CardDescription>Tests connection to the Neon PostgreSQL database</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Testing database connection...</span>
              </div>
            ) : results?.database ? (
              <div className="flex items-center gap-2">
                {getStatusIcon(results.database.status)}
                <span>{results.database.message}</span>
              </div>
            ) : (
              <div className="text-red-500">No database information available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>Checks if email sending is properly configured</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Checking email configuration...</span>
              </div>
            ) : results?.email ? (
              <div className="flex items-center gap-2">
                {getStatusIcon(results.email.status)}
                <span>{results.email.message}</span>
              </div>
            ) : (
              <div className="text-red-500">No email information available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Environment Variables
            </CardTitle>
            <CardDescription>Checks if all required environment variables are set</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Checking environment variables...</span>
              </div>
            ) : results?.environmentVariables ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Database Variables</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(results.environmentVariables.database).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center gap-2">
                        {value === "✓ Set" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Email Variables</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(results.environmentVariables.email).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center gap-2">
                        {value === "✓ Set" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Auth Variables</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(results.environmentVariables.auth).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center gap-2">
                        {value === "✓ Set" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-red-500">No environment variable information available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button onClick={runDiagnostic} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostic...
            </>
          ) : (
            <>Run Diagnostic Again</>
          )}
        </Button>
      </div>
    </div>
  )
}
