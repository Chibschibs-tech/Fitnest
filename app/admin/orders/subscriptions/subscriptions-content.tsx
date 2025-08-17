"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Play, Pause, X, Eye } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Subscription {
  id: number
  user_id: number
  customer_name: string
  customer_email: string
  plan_name: string
  status: "active" | "paused" | "cancelled"
  weekly_price: number
  start_date: string
  next_delivery: string
  total_orders: number
  total_spent: number
  pause_reason?: string
  created_at: string
}

export function SubscriptionsContent() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

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
      setSubscriptions(data.subscriptions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch subscriptions")
    } finally {
      setLoading(false)
    }
  }

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "paused":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleStatusUpdate = async (subscriptionId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setSubscriptions((prev) =>
          prev.map((sub) => (sub.id === subscriptionId ? { ...sub, status: newStatus as any } : sub)),
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
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-gray-600">Manage customer meal plan subscriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {subscriptions.filter((s) => s.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Paused</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {subscriptions.filter((s) => s.status === "paused").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {subscriptions.filter((s) => s.status === "cancelled").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + s.weekly_price, 0) * 4
              ).toFixed(2)}{" "}
              MAD
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
                placeholder="Search by customer name, email, or plan..."
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
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscriptions ({filteredSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Weekly Price</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Next Delivery</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{subscription.customer_name}</div>
                      <div className="text-sm text-gray-500">{subscription.customer_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{subscription.plan_name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(subscription.status)}>{subscription.status}</Badge>
                  </TableCell>
                  <TableCell>{subscription.weekly_price} MAD</TableCell>
                  <TableCell>{new Date(subscription.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {subscription.next_delivery ? new Date(subscription.next_delivery).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>{subscription.total_orders}</TableCell>
                  <TableCell>{subscription.total_spent.toFixed(2)} MAD</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {subscription.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(subscription.id, "paused")}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {subscription.status === "paused" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(subscription.id, "active")}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {subscription.status !== "cancelled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(subscription.id, "cancelled")}
                        >
                          <X className="h-4 w-4" />
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

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No subscriptions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
