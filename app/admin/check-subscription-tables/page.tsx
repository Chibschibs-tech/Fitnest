"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database, Table } from "lucide-react"

interface TableInfo {
  structure: Array<{
    column_name: string
    data_type: string
    is_nullable: string
    column_default: string | null
  }>
  count: number
}

interface CheckResult {
  success: boolean
  existingTables: string[]
  missingTables: string[]
  productsStructure: Array<{
    column_name: string
    data_type: string
    is_nullable: string
    column_default: string | null
  }>
  sampleProducts: Array<{
    id: number
    name: string
    price: string
    product_type: string
  }>
  subscriptionTablesInfo: Record<string, TableInfo>
  error?: string
}

export default function CheckSubscriptionTablesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<CheckResult | null>(null)

  useEffect(() => {
    checkTables()
  }, [])

  const checkTables = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/check-subscription-tables")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        existingTables: [],
        missingTables: [],
        productsStructure: [],
        sampleProducts: [],
        subscriptionTablesInfo: {},
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  if (!result) {
    return (
      <div className="container mx-auto py-8">
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>Failed to check database tables</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Tables Status</h1>

        {/* Tables Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Tables Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-green-700 mb-2">Existing Tables</h3>
                {result.existingTables.length > 0 ? (
                  <div className="space-y-1">
                    {result.existingTables.map((table) => (
                      <Badge key={table} variant="outline" className="mr-2 border-green-200 text-green-700">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {table}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tables found</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-red-700 mb-2">Missing Tables</h3>
                {result.missingTables.length > 0 ? (
                  <div className="space-y-1">
                    {result.missingTables.map((table) => (
                      <Badge key={table} variant="outline" className="mr-2 border-red-200 text-red-700">
                        <XCircle className="mr-1 h-3 w-3" />
                        {table}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-600">All required tables exist!</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        {result.existingTables.includes("products") && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Table className="mr-2 h-5 w-5" />
                Products Table Structure
              </CardTitle>
              <CardDescription>Current structure and sample data from your products table</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Table Structure</h4>
                  <div className="space-y-2">
                    {result.productsStructure.map((column) => (
                      <div key={column.column_name} className="flex justify-between text-sm">
                        <span className="font-mono">{column.column_name}</span>
                        <span className="text-gray-500">{column.data_type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Sample Products</h4>
                  <div className="space-y-2">
                    {result.sampleProducts.map((product) => (
                      <div key={product.id} className="text-sm border rounded p-2">
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-gray-500">
                          Price: {product.price} | Type: {product.product_type || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Tables */}
        {Object.keys(result.subscriptionTablesInfo).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription Tables</CardTitle>
              <CardDescription>Structure and data counts for subscription-related tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(result.subscriptionTablesInfo).map(([tableName, info]) => (
                  <div key={tableName} className="border rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{tableName}</h4>
                      <Badge variant="outline">{info.count} rows</Badge>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                      {info.structure.map((column) => (
                        <div key={column.column_name} className="font-mono text-xs">
                          {column.column_name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {result.error && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>Error: {result.error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
