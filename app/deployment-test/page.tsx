"use client"

import { useEffect, useState } from "react"

export default function DeploymentTestPage() {
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [diagnosticStatus, setDiagnosticStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkStatus() {
      try {
        setLoading(true)

        // Check health endpoint
        const healthResponse = await fetch("/api/health")
        const healthData = await healthResponse.json()
        setHealthStatus(healthData)

        // Check diagnostic endpoint
        const diagnosticResponse = await fetch("/api/deployment-diagnostic")
        const diagnosticData = await diagnosticResponse.json()
        setDiagnosticStatus(diagnosticData)

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        setLoading(false)
      }
    }

    checkStatus()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Checking Deployment Status...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Deployment Test Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Deployment Test Results</h1>

      {/* Health Status */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">API Health</h2>
        <div className="bg-gray-100 p-4 rounded">
          <div className="flex items-center mb-2">
            <div
              className={`w-4 h-4 rounded-full mr-2 ${healthStatus?.status === "ok" ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className="font-medium">Status: {healthStatus?.status}</span>
          </div>
          <p>Timestamp: {healthStatus?.timestamp}</p>
        </div>
      </div>

      {/* Database Status */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Database Connection</h2>
        <div className="bg-gray-100 p-4 rounded">
          <div className="flex items-center mb-2">
            <div
              className={`w-4 h-4 rounded-full mr-2 ${diagnosticStatus?.database?.connected ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className="font-medium">
              {diagnosticStatus?.database?.connected ? "Connected" : "Connection Failed"}
            </span>
          </div>
          {diagnosticStatus?.database?.serverTime && <p>Server Time: {diagnosticStatus.database.serverTime}</p>}
          {diagnosticStatus?.database?.error && (
            <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error: {diagnosticStatus.database.error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Environment Variables */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p className="mb-2 font-medium">Environment: {diagnosticStatus?.environment}</p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Variable</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Set</th>
              </tr>
            </thead>
            <tbody>
              {diagnosticStatus?.environmentVariables &&
                Object.entries(diagnosticStatus.environmentVariables).map(([key, value]) => (
                  <tr key={key}>
                    <td className="border border-gray-300 px-4 py-2">{key}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${value ? "bg-green-500" : "bg-red-500"}`}></div>
                        {value ? "Yes" : "No"}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Data (for debugging) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Raw Diagnostic Data</h2>
        <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          <pre>{JSON.stringify(diagnosticStatus, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
