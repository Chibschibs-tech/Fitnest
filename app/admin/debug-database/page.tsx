"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database, RefreshCw, Trash2 } from "lucide-react"

interface DatabaseDiagnostic {
  tables: string[]
  users: {
    structure: Array<{ column_name: string; data_type: string; is_nullable: string }>
    count: number
    sample: Array<any>
  }
  orders: {
    structure: Array<{ column_name: string; data_type: string; is_nullable: string }>
    count: number
    sample: Array<any>
  }
  waitlist: {
    structure: Array<{ column_name: string; data_type: string; is_nullable: string }>
    count: number
    sample: Array<any>
  }
  timestamp: string
}

export default function DebugDatabasePage() {
  const [diagnostic, setDiagnostic] = useState<DatabaseDiagnostic | null>(null)
  const [loading, setLoading] = useState(false)
  const [cleaningData, setCleaningData] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const runDiagnostic = async () => {
    try {
      setLoading(true)
      setMessage(null)

      const response = await fetch("/api/admin/debug-database", {
        method: "GET",
        credentials: "include",
      })

      const data = await response.json()

      if (data.success) {
        setDiagnostic(data.diagnostic)
        setMessage("Database diagnostic completed successfully")
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error running diagnostic:", error)
      setMessage("Failed to run database diagnostic")
    } finally {
      setLoading(false)
    }
  }

  const cleanSampleData = async () => {
    try {
      setCleaningData(true)
      setMessage(null)

      const response = await fetch("/api/admin/clean-sample-data", {
        method: "POST",
        credentials: "include",
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        // Re-run diagnostic to show updated data
        setTimeout(() => runDiagnostic(), 1000)
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error cleaning sample data:", error)
      setMessage("Failed to clean sample data")
    } finally {
      setCleaningData(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </div>
        <div className="flex gap-2">
          <Button onClick={cleanSampleData} variant="destructive" disabled={cleaningData}>
            <Trash2 className="h-4 w-4 mr-2" />
            {cleaningData ? "Cleaning..." : "Clean Sample Data"}
          </Button>
          <Button onClick={runDiagnostic} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {loading ? "Running..." : "Run Diagnostic"}
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Database Diagnostic</h1>
        <p className="text-muted-foreground">Debug and analyze database structure and content</p>
      </div>

      {message && (
        <Card className={message.includes("Error") ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <CardContent className="pt-6">
            <p className={message.includes("Error") ? "text-red-600" : "text-green-600"}>{message}</p>
          </CardContent>
        </Card>
      )}

      {!diagnostic && !loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Database className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No diagnostic data</h3>
            <p className="mt-1 text-sm text-gray-500">Click "Run Diagnostic" to analyze the database</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Running database diagnostic...</p>
          </CardContent>
        </Card>
      )}

      {diagnostic && (
        <div className="space-y-6">
          {/* Tables Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Database Tables ({diagnostic.tables.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {diagnostic.tables.map((table) => (
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
              <CardTitle>Users Table ({diagnostic.users.count} records)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Structure:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {diagnostic.users.structure.map((col, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{col.column_name}</span>
                      <span className="text-muted-foreground ml-2">({col.data_type})</span>
                    </div>
                  ))}
                </div>
              </div>

              {diagnostic.users.sample.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Sample Data:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">ID</th>
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Email</th>
                          <th className="text-left py-2">Role</th>
                          <th className="text-left py-2">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnostic.users.sample.slice(0, 5).map((user, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{user.id}</td>
                            <td className="py-2">{user.name || "N/A"}</td>
                            <td className="py-2">{user.email || "N/A"}</td>
                            <td className="py-2">{user.role || "user"}</td>
                            <td className="py-2">
                              {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
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
              <CardTitle>Orders Table ({diagnostic.orders.count} records)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Structure:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {diagnostic.orders.structure.map((col, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{col.column_name}</span>
                      <span className="text-muted-foreground ml-2">({col.data_type})</span>
                    </div>
                  ))}
                </div>
              </div>

              {diagnostic.orders.sample.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Sample Data:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">ID</th>
                          <th className="text-left py-2">User ID</th>
                          <th className="text-left py-2">Total</th>
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnostic.orders.sample.slice(0, 5).map((order, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{order.id}</td>
                            <td className="py-2">{order.user_id}</td>
                            <td className="py-2">{order.total || order.total_amount || "N/A"}</td>
                            <td className="py-2">{order.status || "N/A"}</td>
                            <td className="py-2">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
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

          {/* Waitlist Table */}
          <Card>
            <CardHeader>
              <CardTitle>Waitlist Table ({diagnostic.waitlist.count} records)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Structure:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {diagnostic.waitlist.structure.map((col, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{col.column_name}</span>
                      <span className="text-muted-foreground ml-2">({col.data_type})</span>
                    </div>
                  ))}
                </div>
              </div>

              {diagnostic.waitlist.sample.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Sample Data:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          {Object.keys(diagnostic.waitlist.sample[0] || {})
                            .slice(0, 6)
                            .map((key) => (
                              <th key={key} className="text-left py-2 capitalize">
                                {key.replace(/_/g, " ")}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {diagnostic.waitlist.sample.slice(0, 5).map((entry, index) => (
                          <tr key={index} className="border-b">
                            {Object.values(entry)
                              .slice(0, 6)
                              .map((value, valueIndex) => (
                                <td key={valueIndex} className="py-2">
                                  {value ? String(value).substring(0, 50) : "N/A"}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diagnostic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Diagnostic completed at: {new Date(diagnostic.timestamp).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
