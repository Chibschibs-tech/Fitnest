"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Mail, Phone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  city?: string
  total_orders: number
  total_spent: number
  subscription_status: "active" | "paused" | "cancelled" | "none"
  created_at: string
  last_order_date?: string
}

export function CustomersContent() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/customers")
      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }
      const data = await response.json()
      setCustomers(data.customers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customers")
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm)),
  )

  const getSubscriptionBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "paused":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "none":
        return "outline"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-gray-600">Manage your customers and their information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter((c) => c.subscription_status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.reduce((sum, c) => sum + c.total_spent, 0).toFixed(2)} MAD
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.length > 0
                ? (
                    customers.reduce((sum, c) => sum + c.total_spent, 0) /
                      customers.reduce((sum, c) => sum + c.total_orders, 0) || 0
                  ).toFixed(2)
                : "0.00"}{" "}
              MAD
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">
                        Customer since {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-xs">{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{customer.city || "N/A"}</TableCell>
                  <TableCell>{customer.total_orders}</TableCell>
                  <TableCell>{customer.total_spent.toFixed(2)} MAD</TableCell>
                  <TableCell>
                    <Badge variant={getSubscriptionBadgeVariant(customer.subscription_status)}>
                      {customer.subscription_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No customers found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
