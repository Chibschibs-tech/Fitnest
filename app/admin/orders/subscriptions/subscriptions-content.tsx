"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Users, UserCheck, DollarSign, Calendar, RefreshCw } from "lucide-react"

interface Subscription {
  id: string
  customer_name: string
  customer_email: string
  plan_name: string
  status: "active" | "paused" | "cancelled"
  weekly_price: number
  start_date: string
  next_delivery: string
  total_orders: number
  total_spent: number
}

export default function SubscriptionsContent() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/admin/subscriptions")
      const data = await response.json()

      if (data.success) {
        setSubscriptions(data.subscriptions || [])
      } else {
        setError(data.error || "Failed to fetch subscriptions")
        setSubscriptions([])
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      setError("Failed to fetch subscriptions")
      setSubscriptions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length
  const pausedSubscriptions = subscriptions.filter((s) => s.status === "paused").length
  const totalRevenue = subscriptions.reduce((sum, s) => sum + Number(s.total_spent || 0), 0)

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} MAD`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const updateSubscriptionStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/subscriptions/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchSubscriptions() // Refresh the data
      } else {
        console.error("Failed to update subscription status")
      }
    } catch (error) {
      console.error("Error updating subscription status:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscription Management</h1>
            <p className="text-muted-foreground">Manage customer subscriptions</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Manage customer subscriptions</p>
        </div>
        <Button onClick={fetchSubscriptions} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchSubscriptions} variant="outline" size="sm">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSubscriptions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paused Subscriptions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pausedSubscriptions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions ({filteredSubscriptions.length})</CardTitle>
          <p className="text-sm text-muted-foreground">Manage customer subscriptions and their delivery schedules</p>
        </CardHeader>
        <CardContent>
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "No subscriptions found matching your criteria." : "No subscriptions found."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Plan</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Weekly Price</th>
                    <th className="text-left py-3 px-4 font-medium">Next Delivery</th>
                    <th className="text-left py-3 px-4 font-medium">Total Spent</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{subscription.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{subscription.customer_email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{subscription.plan_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            subscription.status === "active"
                              ? "default"
                              : subscription.status === "paused"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {subscription.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{formatCurrency(Number(subscription.weekly_price))}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{formatDate(subscription.next_delivery)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{formatCurrency(Number(subscription.total_spent))}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {subscription.status === "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSubscriptionStatus(subscription.id, "paused")}
                            >
                              Pause
                            </Button>
                          ) : subscription.status === "paused" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSubscriptionStatus(subscription.id, "active")}
                            >
                              Resume
                            </Button>
                          ) : null}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
