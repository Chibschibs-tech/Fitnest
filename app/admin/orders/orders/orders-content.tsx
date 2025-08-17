"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Package, Calendar, DollarSign } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Order {
  id: number
  customer_name: string
  customer_email: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total_amount: number
  order_type: "meal_plan" | "express_shop" | "mixed"
  items_count: number
  order_date: string
  delivery_date?: string
  payment_status: "pending" | "paid" | "failed" | "refunded"
  delivery_address: string
}

export function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/orders/all")
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesType = typeFilter === "all" || order.order_type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline"
      case "processing":
        return "default"
      case "shipped":
        return "default"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "outline"
      case "failed":
        return "destructive"
      case "refunded":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getOrderTypeLabel = (type: string) => {
    switch (type) {
      case "meal_plan":
        return "Meal Plan"
      case "express_shop":
        return "Express Shop"
      case "mixed":
        return "Mixed"
      default:
        return type
    }
  }

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? { ...order, status: newStatus as any } : order)),
        )
      }
    } catch (err) {
      console.error("Failed to update status:", err)
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
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-gray-600">Manage all customer orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {orders.filter((o) => o.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter((o) => o.status === "processing").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter((o) => o.status === "delivered").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)} MAD
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by customer name, email, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="meal_plan">Meal Plan</option>
              <option value="express_shop">Express Shop</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">#{order.id}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getOrderTypeLabel(order.order_type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>{order.items_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>{order.total_amount.toFixed(2)} MAD</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPaymentBadgeVariant(order.payment_status)}>{order.payment_status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{new Date(order.order_date).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(order.id, "processing")}>
                          Process
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(order.id, "shipped")}>
                          Ship
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
