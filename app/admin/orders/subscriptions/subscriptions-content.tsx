"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Pause, Play, Eye } from "lucide-react"

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
    (subscription) =>
      subscription.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.mealPlanName?.toLowerCase().includes(searchTerm.toLowerCase()),
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
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Total Subscriptions</h3>
          <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-green-600">
            {subscriptions.filter((s) => s.status === "active").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Paused</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {subscriptions.filter((s) => s.status === "paused").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(
              subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + Number(s.total), 0),
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search subscriptions by customer or meal plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Meal Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Next Delivery</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{subscription.customerName}</div>
                    <div className="text-sm text-gray-500">{subscription.customerEmail}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{subscription.mealPlanName || "Custom Plan"}</div>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(Number(subscription.total))}</TableCell>
                <TableCell>
                  <Badge variant="outline">{subscription.deliveryFrequency || "Weekly"}</Badge>
                </TableCell>
                <TableCell>{subscription.nextDelivery ? formatDate(subscription.nextDelivery) : "TBD"}</TableCell>
                <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                <TableCell>{formatDate(subscription.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {subscription.status === "active" ? (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    ) : subscription.status === "paused" ? (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                    ) : null}
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
