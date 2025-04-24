"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function AuthStatusChecker() {
  const { data: session, status } = useSession()
  const [healthCheck, setHealthCheck] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkAuthHealth = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth-health")
      const data = await res.json()
      setHealthCheck(data)
    } catch (err) {
      setError("Failed to check auth health")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Authentication Status</h3>
        <Button variant="outline" size="sm" onClick={checkAuthHealth} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Auth Health"
          )}
        </Button>
      </div>

      <div className="grid gap-2">
        <div className="flex justify-between">
          <span>Session Status:</span>
          <span
            className={`font-medium ${status === "authenticated" ? "text-green-600" : status === "loading" ? "text-amber-600" : "text-red-600"}`}
          >
            {status}
          </span>
        </div>

        {session && (
          <div className="flex justify-between">
            <span>Logged in as:</span>
            <span className="font-medium">
              {session.user?.name} ({session.user?.role})
            </span>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {healthCheck && (
        <div className="mt-4 text-sm">
          <h4 className="font-medium mb-2">Health Check Results:</h4>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">{JSON.stringify(healthCheck, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
