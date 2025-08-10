"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Calendar, Settings, User } from "lucide-react"

interface UserType {
  id?: number
  name: string
  email: string
  role?: string
}

type DashboardPayload = {
  user: UserType
  subscriptions?: any[]
  activeSubscription?: any | null
  orderHistory?: any[]
  upcomingDeliveries?: any[]
  stats?: { totalOrders: number }
}

interface DashboardContentProps {
  user: UserType
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [dashboardData, setDashboardData] = useState<DashboardPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/user/dashboard", { cache: "no-store" })
      if (response.ok) {
        const raw = await response.json()
        // Accept both shapes: flat payload or { status, data }
        const payload: DashboardPayload = raw?.data ?? raw
        setDashboardData(payload)
      } else {
        setDashboardData(null)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      setDashboardData(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const hasActiveSubscription = !!dashboardData?.activeSubscription || (dashboardData?.subscriptions?.length ?? 0) > 0

  const totalOrders = dashboardData?.stats?.totalOrders ?? dashboardData?.orderHistory?.length ?? 0

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Here's your fitness journey overview</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscription</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hasActiveSubscription ? "Active" : "No Plan"}</div>
            <p className="text-xs text-muted-foreground">
              {hasActiveSubscription ? "Your meal plan is active." : "Choose a meal plan"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deliveries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.upcomingDeliveries?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Next 5 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest meal plan orders</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.orderHistory?.length ? (
              <div className="space-y-4">
                {dashboardData.orderHistory.slice(0, 3).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : "Unknown Date"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {(() => {
                          const amt = order.total_amount ?? 0
                          const normalized = amt >= 1000 ? (amt / 100).toFixed(2) : (amt.toFixed?.(2) ?? `${amt}`)
                          return `${normalized} MAD`
                        })()}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{order.status ?? "unknown"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No orders yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-transparent" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Browse Meal Plans
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Delivery
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
