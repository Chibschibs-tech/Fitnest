"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database, Trash2, RefreshCw } from "lucide-react"
import Link from "next/link"

interface DiagnosticData {
  tables: string[]
  userCount: number
  waitlistCount: number
  ordersCount: number
  users: any[]
  waitlist: any[]
  orders: any[]
}

export default function DebugDatabasePage() {
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null)
  const [loading, setLoading] = useState(false)
  const [cleaningData, setCleaningData] = useState(false)
  const [message, setMessage] = useState("")

  const runDiagnostic = async () => {
    try {
      setLoading(true)
      setMessage("")

      const response = await fetch("/api/admin/debug-database")
      const data = await response.json()

      if (data.success) {
        setDiagnosticData(data)
        setMessage("Database diagnostic completed successfully")
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const cleanSampleData = async () => {
    try {
      setCleaningData(true)
      setMessage("")

      const response = await fetch("/api/admin/clean-sample-data", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        setMessage(`✅ ${data.message}`)
        // Refresh diagnostic data
        await runDiagnostic()
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setCleaningData(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Database Diagnostic</h1>
            <p className="text-gray-600">Debug and analyze database structure and content</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={cleanSampleData} disabled={cleaningData} variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            {cleaningData ? "Cleaning..." : "Clean Sample Data"}
          </Button>
          <Button onClick={runDiagnostic} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {loading ? "Running..." : "Run Diagnostic"}
          </Button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <Card
          className={
            message.includes("Error") || message.includes("❌")
              ? "border-red-200 bg-red-50"
              : "border-green-200 bg-green-50"
          }
        >
          <CardContent className="p-4">
            <p className={message.includes("Error") || message.includes("❌") ? "text-red-800" : "text-green-800"}>
              {message}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Diagnostic Results */}
      {diagnosticData && (
        <div className="space-y-6">
          {/* Database Tables Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Database Tables ({diagnosticData.tables.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {diagnosticData.tables.map((table) => (
                  <Badge key={table} variant="outline">
                    {table}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users Table ({diagnosticData.userCount} records)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Structure:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>id</strong> (integer)
                  </p>
                  <p>
                    <strong>name</strong> (text)
                  </p>
                  <p>
                    <strong>email</strong> (text)
                  </p>
                  <p>
                    <strong>password</strong> (text)
                  </p>
                  <p>
                    <strong>role</strong> (USER-DEFINED)
                  </p>
                  <p>
                    <strong>created_at</strong> (timestamp without time zone)
                  </p>
                  <p>
                    <strong>updated_at</strong> (timestamp without time zone)
                  </p>
                  <p>
                    <strong>acquisition_source</strong> (character varying)
                  </p>
                </div>
              </div>

              {diagnosticData.users.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Sample Data:</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border border-gray-200 px-3 py-2 text-left">ID</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">Name</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">Email</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">Role</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosticData.users.slice(0, 10).map((user) => (
                          <tr key={user.id}>
                            <td className="border border-gray-200 px-3 py-2">{user.id}</td>
                            <td className="border border-gray-200 px-3 py-2">{user.name}</td>
                            <td className="border border-gray-200 px-3 py-2">{user.email}</td>
                            <td className="border border-gray-200 px-3 py-2">
                              <Badge variant={user.role === "admin" ? "destructive" : "default"}>{user.role}</Badge>
                            </td>
                            <td className="border border-gray-200 px-3 py-2">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Orders Table ({diagnosticData.ordersCount} records)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Structure:</h4>
                <div className="text-sm text-gray-600">
                  {diagnosticData.ordersCount === 0 ? (
                    <p>No orders found in the database.</p>
                  ) : (
                    <p>Order structure and sample data would be displayed here.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Waitlist Table */}
          <Card>
            <CardHeader>
              <CardTitle>Waitlist Table ({diagnosticData.waitlistCount} records)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Structure:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>id</strong> (integer)
                  </p>
                  <p>
                    <strong>email</strong> (character varying)
                  </p>
                  <p>
                    <strong>first_name</strong> (character varying)
                  </p>
                  <p>
                    <strong>last_name</strong> (character varying)
                  </p>
                  <p>
                    <strong>phone</strong> (character varying)
                  </p>
                  <p>
                    <strong>city</strong> (character varying)
                  </p>
                  <p>
                    <strong>status</strong> (character varying)
                  </p>
                  <p>
                    <strong>joined_at</strong> (timestamp without time zone)
                  </p>
                  <p>
                    <strong>firstname</strong> (character varying)
                  </p>
                  <p>
                    <strong>lastname</strong> (character varying)
                  </p>
                  <p>
                    <strong>mealplanpreference</strong> (character varying)
                  </p>
                  <p>
                    <strong>wants_notifications</strong> (boolean)
                  </p>
                  <p>
                    <strong>created_at</strong> (timestamp without time zone)
                  </p>
                  <p>
                    <strong>contacted_at</strong> (timestamp without time zone)
                  </p>
                  <p>
                    <strong>position</strong> (integer)
                  </p>
                  <p>
                    <strong>meal_plan_preference</strong> (character varying)
                  </p>
                  <p>
                    <strong>notifications</strong> (boolean)
                  </p>
                </div>
              </div>

              {diagnosticData.waitlist.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Sample Data:</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border border-gray-200 px-3 py-2 text-left">ID</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">First Name</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">Last Name</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">Email</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">Phone</th>
                          <th className="border border-gray-200 px-3 py-2 text-left">City</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosticData.waitlist.slice(0, 10).map((entry) => (
                          <tr key={entry.id}>
                            <td className="border border-gray-200 px-3 py-2">{entry.id}</td>
                            <td className="border border-gray-200 px-3 py-2">{entry.first_name}</td>
                            <td className="border border-gray-200 px-3 py-2">{entry.last_name}</td>
                            <td className="border border-gray-200 px-3 py-2">{entry.email}</td>
                            <td className="border border-gray-200 px-3 py-2">{entry.phone}</td>
                            <td className="border border-gray-200 px-3 py-2">{entry.city}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Diagnostic Information */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Diagnostic completed at: {new Date().toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
