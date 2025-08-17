"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, User, Mail, Calendar, DollarSign, Package, CreditCard } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Customer {
  id: number
  name: string
  email: string
  role: string
  created_at: string
  orders: Array<{
    id: number
    status: string
    total: number
    total_amount: number
    created_at: string
    order_type: string
    meal_plan_name?: string
  }>
  subscriptions: Array<{
    id: number
    status: string
    total: number
    total_amount: number
    created_at: string
    plan_name?: string
    weekly_price?: number
  }>
  stats: {
    totalOrders: number
    totalSpent: number
    activeSubscriptions: number
  }
}

interface CustomerDetailContentProps {
  customerId: string
}

export function CustomerDetailContent({ customerId }: CustomerDetailContentProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    fetchCustomerDetails()
  }, [customerId])

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/customers/${customerId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch customer details")
      }
      const data = await response.json()
      setCustomer(data.customer)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customer details")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return "0 MAD"
    return `${Number(amount).toFixed(2)} MAD`
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

  if (!customer) {
    return (
      <Alert>
        <AlertDescription>Customer not found</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Customer Details</h1>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Info</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{customer.name}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-1" />
                {customer.email}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {formatDate(customer.created_at)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(customer.stats.totalSpent)}</div>
            <p className="text-xs text-muted-foreground">Across {customer.stats.totalOrders} orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Order History ({customer.orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customer.orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Meal Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.order_type || "order"}</Badge>
                    </TableCell>
                    <TableCell>{order.meal_plan_name || "N/A"}</TableCell>
                    <TableCell>{formatCurrency(order.total || order.total_amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Subscriptions ({customer.subscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customer.subscriptions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscription ID</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Weekly Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">#{subscription.id}</TableCell>
                    <TableCell>{formatDate(subscription.created_at)}</TableCell>
                    <TableCell>{subscription.plan_name || "Custom Plan"}</TableCell>
                    <TableCell>{formatCurrency(subscription.weekly_price || subscription.total)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          subscription.status === "active" || subscription.status === "pending"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {subscription.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No subscriptions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
