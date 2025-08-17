"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Truck, Calendar, MapPin, Package } from "lucide-react"

interface Delivery {
  id: number
  customerName: string
  customerEmail: string
  address: string
  deliveryDate: string
  status: string
  orderTotal: number
  driverName?: string
  trackingNumber?: string
  createdAt: string
}

export default function DeliveriesContent() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

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
      setDeliveries(data)
    } catch (error) {
      console.error("Error fetching deliveries:", error)
      setError("Failed to load deliveries")
    } finally {
      setLoading(false)
    }
  }

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "in_transit":
        return <Badge className="bg-yellow-100 text-yellow-800">In Transit</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading deliveries...</div>
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchDeliveries}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {deliveries.filter((d) => d.status === "in_transit").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {deliveries.filter((d) => d.status === "delivered").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {deliveries.length > 0
                ? Math.round((deliveries.filter((d) => d.status === "delivered").length / deliveries.length) * 100)
                : 0}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search deliveries by customer, email, or tracking number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Deliveries Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{delivery.customerName}</div>
                    <div className="text-sm text-gray-500">{delivery.customerEmail}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="max-w-xs truncate">{delivery.address}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(delivery.deliveryDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Truck className="h-4 w-4 mr-1" />
                    {delivery.driverName || "Not assigned"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-mono">{delivery.trackingNumber || "N/A"}</div>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(delivery.orderTotal)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Track
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredDeliveries.length === 0 && (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No deliveries found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "No deliveries have been scheduled yet."}
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
