"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, User, Calendar, Package } from "lucide-react"

interface Subscription {
  id: number
  customerName: string
  customerEmail: string
  mealPlanName: string
  total: number
  status: string
  createdAt: string
  deliveryFrequency: string
  nextDelivery?: string
}

export default function SubscriptionsContent() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/subscriptions")
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions")
      }
      const data = await response.json()
      setSubscriptions(data)
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      setError("Failed to load subscriptions")
    } finally {
      setLoading(false)
    }
  }

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading subscriptions...</div>
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchSubscriptions}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {subscriptions.filter((s) => s.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Paused</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {subscriptions.filter((s) => s.status === "paused").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + Number(s.total), 0) * 4,
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search subscriptions by customer name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subscriptions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Next Delivery</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <User className="h-8 w-8 text-gray-400" />
                    <div>
                      <div className="font-medium">{subscription.customerName}</div>
                      <div className="text-sm text-gray-500">{subscription.customerEmail}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{subscription.mealPlanName || "Custom Plan"}</div>
                </TableCell>
                <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{subscription.deliveryFrequency || "Weekly"}</Badge>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(Number(subscription.total))}</TableCell>
                <TableCell>
                  {subscription.nextDelivery ? (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(subscription.nextDelivery).toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-gray-400">Not scheduled</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View
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

        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No subscriptions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "No active subscriptions at the moment."}
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
