"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, User, Calendar, DollarSign, AlertTriangle } from "lucide-react"

interface Order {
  id: number
  user_id: number
  customer_name: string
  customer_email: string
  plan_name: string
  total_amount: number
  status: string
  created_at: string
  selected_days: string
  selected_weeks: number
}

export function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        setError("Failed to load orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (response.ok) {
        fetchOrders() // Refresh the list
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, className: "bg-green-100 text-green-700" },
      paused: { variant: "outline" as const, className: "bg-yellow-50 text-yellow-700" },
      completed: { variant: "outline" as const, className: "bg-blue-50 text-blue-700" },
      cancelled: { variant: "outline" as const, className: "bg-red-50 text-red-700" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredOrders = orders.filter((order) => statusFilter === "all" || order.status === statusFilter)

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading orders...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 animate-pulse rounded-md bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-gray-600">View and manage all customer orders and subscriptions</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-600">Total: {filteredOrders.length} orders</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>Customer meal plan orders and subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {statusFilter === "all" ? "No orders have been placed yet." : `No ${statusFilter} orders found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{order.customer_name || "Unknown Customer"}</p>
                            <p className="text-gray-500">{order.customer_email}</p>
                          </div>
                        </div>

                        <div>
                          <p className="font-medium">{order.plan_name || "Meal Plan"}</p>
                          <p className="text-gray-500">
                            {order.selected_weeks} week{order.selected_weeks !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{order.total_amount} MAD</p>
                            <p className="text-gray-500">Total Amount</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{formatDate(order.created_at)}</p>
                            <p className="text-gray-500">Order Date</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>

                      {order.status === "active" && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, "paused")}
                          variant="outline"
                          size="sm"
                          className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          Pause
                        </Button>
                      )}

                      {order.status === "paused" && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, "active")}
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
