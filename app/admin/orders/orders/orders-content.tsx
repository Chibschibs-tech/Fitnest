"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Package, Truck } from "lucide-react"

interface Order {
  id: number
  customerName: string
  customerEmail: string
  orderType: string
  total: number
  status: string
  createdAt: string
  itemCount: number
}

export default function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

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
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm),
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>
      case "preparing":
        return <Badge className="bg-orange-100 text-orange-800">Preparing</Badge>
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getOrderTypeBadge = (type: string) => {
    switch (type) {
      case "subscription":
        return (
          <Badge variant="outline" className="bg-blue-50">
            Subscription
          </Badge>
        )
      case "one_time":
        return (
          <Badge variant="outline" className="bg-green-50">
            One-time
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading orders...</div>
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchOrders}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{orders.filter((o) => o.status === "pending").length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Preparing</h3>
          <p className="text-2xl font-bold text-orange-600">{orders.filter((o) => o.status === "preparing").length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Shipped</h3>
          <p className="text-2xl font-bold text-purple-600">{orders.filter((o) => o.status === "shipped").length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(orders.reduce((sum, o) => sum + Number(o.total), 0))}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders by customer, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
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
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </div>
                </TableCell>
                <TableCell>{getOrderTypeBadge(order.orderType)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1 text-gray-400" />
                    {order.itemCount} items
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(Number(order.total))}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {order.status === "confirmed" && (
                      <Button variant="outline" size="sm">
                        <Truck className="h-4 w-4 mr-1" />
                        Ship
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
