"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database, Users, ShoppingCart, UserPlus } from "lucide-react"

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

export default function DatabaseDebugPage() {
  const [diagnostic, setDiagnostic] = useState<DatabaseDiagnostic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDiagnostic = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/admin/debug-database")
      const data = await response.json()

      if (data.success) {
        setDiagnostic(data.diagnostic)
      } else {
        setError(data.error || "Failed to fetch diagnostic")
      }
    } catch (error) {
      console.error("Error fetching diagnostic:", error)
      setError("Failed to fetch diagnostic")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiagnostic()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Database Diagnostic</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading database information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Database Diagnostic</h1>
          <Button onClick={fetchDiagnostic} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Diagnostic</h1>
          <p className="text-muted-foreground">Check database structure and content</p>
        </div>
        <Button onClick={fetchDiagnostic} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {diagnostic && (
        <>
          {/* Tables Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Available Tables ({diagnostic.tables.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {diagnostic.tables.map((table) => (
                  <div key={table} className="p-2 bg-muted rounded text-sm">
                    {table}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Users Table ({diagnostic.users.count} records)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Structure:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Column</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Nullable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnostic.users.structure.map((col) => (
                        <tr key={col.column_name} className="border-b">
                          <td className="py-1">{col.column_name}</td>
                          <td className="py-1">{col.data_type}</td>
                          <td className="py-1">{col.is_nullable}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                        {diagnostic.users.sample.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="py-1">{user.id}</td>
                            <td className="py-1">{user.name || "N/A"}</td>
                            <td className="py-1">{user.email || "N/A"}</td>
                            <td className="py-1">{user.role || "user"}</td>
                            <td className="py-1">
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
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Orders Table ({diagnostic.orders.count} records)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Structure:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Column</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Nullable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnostic.orders.structure.map((col) => (
                        <tr key={col.column_name} className="border-b">
                          <td className="py-1">{col.column_name}</td>
                          <td className="py-1">{col.data_type}</td>
                          <td className="py-1">{col.is_nullable}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                        {diagnostic.orders.sample.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="py-1">{order.id}</td>
                            <td className="py-1">{order.user_id || "N/A"}</td>
                            <td className="py-1">{order.total || order.total_amount || "N/A"}</td>
                            <td className="py-1">{order.status || "N/A"}</td>
                            <td className="py-1">
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
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Waitlist Table ({diagnostic.waitlist.count} records)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Structure:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Column</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Nullable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnostic.waitlist.structure.map((col) => (
                        <tr key={col.column_name} className="border-b">
                          <td className="py-1">{col.column_name}</td>
                          <td className="py-1">{col.data_type}</td>
                          <td className="py-1">{col.is_nullable}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {diagnostic.waitlist.sample.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Sample Data:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">ID</th>
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Email</th>
                          <th className="text-left py-2">Phone</th>
                          <th className="text-left py-2">City</th>
                          <th className="text-left py-2">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnostic.waitlist.sample.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-1">{item.id}</td>
                            <td className="py-1">{item.name || "N/A"}</td>
                            <td className="py-1">{item.email || "N/A"}</td>
                            <td className="py-1">{item.phone || "N/A"}</td>
                            <td className="py-1">{item.city || "N/A"}</td>
                            <td className="py-1">
                              {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
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

          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(diagnostic.timestamp).toLocaleString()}
          </div>
        </>
      )}
    </div>
  )
}
