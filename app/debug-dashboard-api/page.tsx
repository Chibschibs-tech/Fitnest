"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugDashboardAPI() {
  const [debugData, setDebugData] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchDebugData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-dashboard")
      const data = await response.json()
      setDebugData(data)
    } catch (error) {
      console.error("Debug fetch error:", error)
    }
    setLoading(false)
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/dashboard")
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Dashboard fetch error:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard API Debug</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchDebugData} disabled={loading} className="mb-4">
              Refresh Debug Data
            </Button>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchDashboardData} disabled={loading} className="mb-4">
              Fetch Dashboard Data
            </Button>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(dashboardData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
