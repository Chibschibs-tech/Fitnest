"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function DiagnosticPage() {
  const [diagnosticData, setDiagnosticData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function runDiagnostic() {
      try {
        setLoading(true)
        const response = await fetch("/api/diagnostic")

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`)
        }

        const data = await response.json()
        setDiagnosticData(data)
        setError(null)
      } catch (err) {
        console.error("Diagnostic error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    runDiagnostic()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">Express Shop Diagnostic</h1>

      {loading ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <p>Running diagnostics...</p>
        </div>
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 text-lg font-medium text-red-800">Error</h2>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <h2 className="mb-4 text-lg font-medium">Diagnostic Results</h2>

          <div className="mb-4">
            <p className="mb-1 font-medium">Database Connection:</p>
            <p className={diagnosticData.databaseConnected ? "text-green-600" : "text-red-600"}>
              {diagnosticData.databaseConnected ? "Connected" : "Failed"}
            </p>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-medium">Environment:</p>
            <p>{diagnosticData.environment}</p>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-medium">Database URL:</p>
            <p>{diagnosticData.databaseUrl}</p>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-medium">Test Query Result:</p>
            <pre className="mt-2 rounded bg-gray-100 p-2 text-sm">{JSON.stringify(diagnosticData.result, null, 2)}</pre>
          </div>

          <div className="mt-6">
            <p className="mb-1 font-medium">Full Diagnostic Data:</p>
            <pre className="mt-2 max-h-60 overflow-auto rounded bg-gray-100 p-2 text-sm">
              {JSON.stringify(diagnosticData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-8 flex space-x-4">
        <Link href="/express-shop" className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
          Back to Express Shop
        </Link>
        <Link href="/express-shop/server" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
          Try Server-Rendered Version
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Run Diagnostics Again
        </button>
      </div>
    </div>
  )
}
