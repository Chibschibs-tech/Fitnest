"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, CheckCircle, Clock, Calendar, User } from "lucide-react"

interface Delivery {
  orderId: number
  customerName: string
  customerEmail: string
  planName: string
  deliveryDate: string
  dayName: string
  weekNumber: number
  status: string
  totalAmount: number
}

export function DeliveryManagementContent() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    try {
      const response = await fetch("/api/admin/get-pending-deliveries")
      const data = await response.json()

      if (data.success) {
        setDeliveries(data.deliveries || [])
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkDelivered = async () => {
    if (selectedDeliveries.length === 0) return

    setActionLoading(true)
    try {
      // Group selected deliveries by order ID
      const deliveriesByOrder: { [key: string]: string[] } = {}
      selectedDeliveries.forEach((deliveryKey) => {
        const [orderId, deliveryDate] = deliveryKey.split("|")
        if (!deliveriesByOrder[orderId]) {
          deliveriesByOrder[orderId] = []
        }
        deliveriesByOrder[orderId].push(deliveryDate)
      })

      // Mark deliveries for each order
      for (const [orderId, deliveryDates] of Object.entries(deliveriesByOrder)) {
        await fetch("/api/admin/mark-delivery-delivered", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: Number.parseInt(orderId),
            deliveryDates,
            status: "delivered",
          }),
        })
      }

      setMessage(`Successfully marked ${selectedDeliveries.length} deliveries as delivered`)
      setSelectedDeliveries([])
      fetchDeliveries() // Refresh the list

      setTimeout(() => setMessage(null), 5000)
    } catch (error) {
      console.error("Error marking deliveries:", error)
      setMessage("Error marking deliveries as delivered")
    } finally {
      setActionLoading(false)
    }
  }

  const toggleDeliverySelection = (orderId: number, deliveryDate: string) => {
    const deliveryKey = `${orderId}|${deliveryDate}`
    setSelectedDeliveries((prev) =>
      prev.includes(deliveryKey) ? prev.filter((key) => key !== deliveryKey) : [...prev, deliveryKey],
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "Invalid Date"
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading deliveries...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 animate-pulse rounded-md bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const pendingDeliveries = deliveries.filter((d) => d.status === "pending")
  const todayDeliveries = deliveries.filter(
    (d) => new Date(d.deliveryDate).toDateString() === new Date().toDateString(),
  )

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Delivery Management</h1>
        <p className="text-gray-600">Manage customer meal deliveries and mark them as completed</p>
      </div>

      {message && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeliveries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayDeliveries.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Deliveries</CardTitle>
              <CardDescription>Select deliveries to mark as completed</CardDescription>
            </div>
            <Button
              onClick={handleMarkDelivered}
              disabled={selectedDeliveries.length === 0 || actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? "Marking..." : `Mark ${selectedDeliveries.length} as Delivered`}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveries.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No deliveries found</h3>
                <p className="mt-1 text-sm text-gray-500">No delivery schedules are available.</p>
              </div>
            ) : (
              deliveries.map((delivery) => {
                const deliveryKey = `${delivery.orderId}|${delivery.deliveryDate}`
                const isSelected = selectedDeliveries.includes(deliveryKey)

                return (
                  <div
                    key={deliveryKey}
                    className={`flex items-center space-x-4 p-4 border rounded-lg ${
                      isSelected ? "bg-blue-50 border-blue-200" : "bg-white"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleDeliverySelection(delivery.orderId, delivery.deliveryDate)}
                      disabled={delivery.status === "delivered"}
                    />

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">Order #{delivery.orderId}</p>
                          <p className="text-sm text-gray-500">{delivery.customerName}</p>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium">{delivery.planName}</p>
                        <p className="text-sm text-gray-500">{delivery.totalAmount} MAD</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{formatDate(delivery.deliveryDate)}</p>
                          <p className="text-sm text-gray-500 capitalize">{delivery.dayName}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm">Week {delivery.weekNumber}</p>
                      </div>

                      <div>{getStatusBadge(delivery.status)}</div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-500">{delivery.customerEmail}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
