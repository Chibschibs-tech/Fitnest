"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingCart } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  created_at: string
  total_orders: number
  total_spent: number
  last_order_date?: string
  status: "active" | "inactive"
}

interface Order {
  id: string
  status: string
  total: number
  created_at: string
  order_type: string
  meal_plan_id?: string
}

interface Subscription {
  id: string
  name: string
  price_per_week: number
  subscription_status: string
  start_date: string
}

interface CustomerDetailContentProps {
  customerId: string
}

export default function CustomerDetailContent({ customerId }: CustomerDetailContentProps) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomerDetails()
  }, [customerId])

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/customers/${customerId}`)
      const data = await response.json()

      if (data.success) {
        setCustomer(data.customer)
        setOrders(data.orders || [])
        setSubscriptions(data.subscriptions || [])
      } else {
        setError(data.error || "Failed to fetch customer details")
      }
    } catch (error) {
      console.error("Error fetching customer details:", error)
      setError("Failed to fetch customer details")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} MAD`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "processing":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error || "Customer not found"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">Customer ID: {customer.id}</p>
          </div>
        </div>
        <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{customer.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined {formatDate(customer.created_at)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Order Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Orders:</span>
              <span className="font-medium">{customer.total_orders}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Spent:</span>
              <span className="font-medium">{formatCurrency(customer.total_spent)}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Order:</span>
              <span className="font-medium">
                {customer.total_orders > 0 ? formatCurrency(customer.total_spent / customer.total_orders) : "0.00 MAD"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last Order:</span>
              <span className="font-medium">
                {customer.last_order_date ? formatDate(customer.last_order_date) : "Never"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Total</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-sm">#{order.id}</td>
                      <td className="py-3 px-4">{formatDate(order.created_at)}</td>
                      <td className="py-3 px-4 capitalize">{order.order_type || "one-time"}</td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(Number(order.total))}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions ({subscriptions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Plan Name</th>
                    <th className="text-left py-3 px-4 font-medium">Weekly Price</th>
                    <th className="text-left py-3 px-4 font-medium">Start Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{subscription.name}</td>
                      <td className="py-3 px-4">{formatCurrency(Number(subscription.price_per_week))}</td>
                      <td className="py-3 px-4">{formatDate(subscription.start_date)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadgeVariant(subscription.subscription_status)}>
                          {subscription.subscription_status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
