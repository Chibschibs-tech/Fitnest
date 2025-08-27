"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function CheckSubscriptionTablesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkTables = async () => {
      try {
        const response = await fetch("/api/admin/check-subscription-tables")
        const result = await response.json()

        if (result.success) {
          setData(result)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    checkTables()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Checking database tables...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert className="border-red-500">
          <XCircle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Database Tables Status</h1>

        {/* Subscription Tables Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Subscription Tables</CardTitle>
            <CardDescription>Status of subscription-related database tables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.tableStats).map(([tableName, stats]: [string, any]) => (
                <div key={tableName} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{tableName}</div>
                    <div className="text-sm text-gray-500">
                      {stats.exists ? `${stats.count} rows` : "Table missing"}
                    </div>
                  </div>
                  <Badge variant={stats.exists ? "default" : "destructive"}>
                    {stats.exists ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    {stats.exists ? "Exists" : "Missing"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Products Table Structure */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Products Table Structure</CardTitle>
            <CardDescription>Column information for the products table</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.productsColumns.map((col: any) => (
                <div key={col.name} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{col.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({col.type})</span>
                  </div>
                  <Badge variant={col.nullable ? "secondary" : "default"}>
                    {col.nullable ? "Nullable" : "Required"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sample Product Data */}
        {data.sampleProducts && (
          <Card>
            <CardHeader>
              <CardTitle>Sample Product Data</CardTitle>
              <CardDescription>Example product from your database</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(data.sampleProducts, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* All Existing Tables */}
        <Card>
          <CardHeader>
            <CardTitle>All Database Tables</CardTitle>
            <CardDescription>Complete list of tables in your database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.tables.map((table: string) => (
                <Badge key={table} variant="outline">
                  {table}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
