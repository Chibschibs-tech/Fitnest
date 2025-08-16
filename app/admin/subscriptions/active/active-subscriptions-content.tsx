"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, PauseCircle, User, Calendar } from "lucide-react"

interface ActiveSubscription {
  id: number
  customerName: string
  customerEmail: string
  planName: string
  totalAmount: number
  status: string
  createdAt: string
  deliveryStartDate: string
  duration: number
  remainingWeeks: number
}

export function ActiveSubscriptionsContent() {
  const [subscriptions, setSubscriptions] = useState<ActiveSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [pausingId, setPausingId] = useState<number | null>(null)

  useEffect(() => {
    fetchActiveSubscriptions()
  }, [])

  const fetchActiveSubscriptions = async () => {
    try {
      const response = await fetch("/api/admin/subscriptions/active")
      const data = await response.json()

      if (data.success) {
        setSubscriptions(data.subscriptions || [])
      }
    } catch (error) {
      console.error("Error fetching active subscriptions:", error)
    } finally {
      setLoading(false)
    }
  }

  const pauseSubscription = async (subscriptionId: number) => {
    setPausingId(subscriptionId)
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/pause`, {
        method: "POST",
      })

      if (response.ok) {
        setSubscriptions(subscriptions.filter((sub) => sub.id !== subscriptionId))
      }
    } catch (error) {
      console.error("Error pausing subscription:", error)
    } finally {
      setPausingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading active subscriptions...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 animate-pulse rounded-md bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.totalAmount, 0)

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Active Subscriptions</h1>
        <p className="text-gray-600">Manage currently active customer subscriptions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue} MAD</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.length > 0
                ? Math.round(subscriptions.reduce((sum, sub) => sum + sub.duration, 0) / subscriptions.length)
                : 0}{" "}
              weeks
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
          <CardDescription>Currently active customer meal plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.length === 0 ? (
              <div className="text-center py-8">
                <PlayCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No active subscriptions</h3>
                <p className="mt-1 text-sm text-gray-500">No customers have active subscriptions.</p>
              </div>
            ) : (
              subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex items-center gap-4">
                    <PlayCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-medium">{subscription.customerName}</p>
                      <p className="text-sm text-gray-500">{subscription.customerEmail}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="font-medium">{subscription.planName}</p>
                    <p className="text-sm text-gray-500">
                      {subscription.remainingWeeks} of {subscription.duration} weeks left
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="font-medium">{subscription.totalAmount} MAD</p>
                    <p className="text-sm text-gray-500">Started: {formatDate(subscription.deliveryStartDate)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => pauseSubscription(subscription.id)}
                      disabled={pausingId === subscription.id}
                      className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                    >
                      <PauseCircle className="h-4 w-4 mr-1" />
                      {pausingId === subscription.id ? "Pausing..." : "Pause"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
