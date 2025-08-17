"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MapPin, Calendar, Package, CheckCircle, Clock, Truck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Delivery {
  id: number
  order_id: number
  customer_name: string
  customer_address: string
  customer_phone?: string
  delivery_date: string
  status: "pending" | "in_transit" | "delivered" | "failed"
  driver_name?: string
  delivery_notes?: string
  created_at: string
  delivered_at?: string
}

export function DeliveriesContent() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/deliveries")
      if (!response.ok) {
        throw new Error("Failed to fetch deliveries")
      }
      const data = await response.json()
      setDeliveries(data.deliveries || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch deliveries")
    } finally {
      setLoading(false)
    }
  }

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.order_id.toString().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <Package className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline"
      case "in_transit":
        return "default"
      case "delivered":
        return "default"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleStatusUpdate = async (deliveryId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/deliveries/${deliveryId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setDeliveries((prev) =>
          prev.map((delivery) =>
            delivery.id === deliveryId
              ? {
                  ...delivery,
                  status: newStatus as any,
                  delivered_at: newStatus === "delivered" ? new Date().toISOString() : delivery.delivered_at,
                }
              : delivery,
          ),
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
          <h1 className="text-2xl font-bold">Delivery Management</h1>
          <p className="text-gray-600">Track and manage delivery schedules</p>
        </div>
        <Button>
          <Package className="h-4 w-4 mr-2" />
          Schedule Delivery
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {deliveries.filter((d) => d.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {deliveries.filter((d) => d.status === "in_transit").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {deliveries.filter((d) => d.status === "delivered").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {deliveries.filter((d) => d.status === "failed").length}
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
                placeholder="Search by customer name, address, or order ID..."
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
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deliveries ({filteredDeliveries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>
                    <div className="font-medium">#{delivery.order_id}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{delivery.customer_name}</div>
                      {delivery.customer_phone && (
                        <div className="text-sm text-gray-500">{delivery.customer_phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div className="text-sm max-w-xs">{delivery.customer_address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div className="text-sm">{new Date(delivery.delivery_date).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(delivery.status)}
                      <Badge variant={getStatusBadgeVariant(delivery.status)}>{delivery.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{delivery.driver_name || "Not assigned"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {delivery.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(delivery.id, "in_transit")}
                        >
                          Start Transit
                        </Button>
                      )}
                      {delivery.status === "in_transit" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(delivery.id, "delivered")}
                        >
                          Mark Delivered
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDeliveries.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No deliveries found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
