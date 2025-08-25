"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Loader2, Database, RefreshCw } from "lucide-react"

export default function CheckSubscriptionTablesPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkTables = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/admin/check-subscription-tables")
      const result = await response.json()

      if (result.success) {
        setData(result)
      } else {
        setError(result.error || "Failed to check tables")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkTables()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Check Subscription Tables</h1>
          <p className="text-gray-600">Verify the subscription system database structure.</p>
        </div>
        <Button onClick={checkTables} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {data && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Table Status
                {data.allTablesExist ? (
                  <Badge className="bg-green-100 text-green-800">All Tables Exist</Badge>
                ) : (
                  <Badge variant="destructive">Missing Tables</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2 text-green-700">Existing Tables:</h3>
                  <ul className="space-y-1">
                    {data.existingTables.map((table: string) => (
                      <li key={table} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{table}</span>
                        <Badge variant="outline">{data.dataCount[table]} rows</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
                {data.missingTables.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-red-700">Missing Tables:</h3>
                    <ul className="space-y-1">
                      {data.missingTables.map((table: string) => (
                        <li key={table} className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span>{table}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {Object.keys(data.tableStructure).map((tableName) => (
            <Card key={tableName}>
              <CardHeader>
                <CardTitle>{tableName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-2">
                  {data.tableStructure[tableName].map((column: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{column.column}</span>
                      <Badge variant="outline">{column.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {!data.allTablesExist && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Some subscription tables are missing. Please create them using the "Create Subscription Tables" page.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}
