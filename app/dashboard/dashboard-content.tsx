"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "./dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ShoppingBag, Calendar, Package, TrendingUp, AlertCircle, ArrowRight, Clock, CheckCircle } from "lucide-react"

interface User {
  id?: string
  name?: string
  email?: string
  image?: string
}

interface DashboardContentProps {
  user: User
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/user/dashboard")

        if (!response.ok) {
          throw new Error("Failed to load dashboard data")
        }

        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        setError("Failed to load your dashboard information. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-medium text-red-800">Error Loading Dashboard</h3>
          <p className="text-red-700">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  // Mock data for demonstration
  const mockData = {
    activeMealPlan: {
      name: "Weight Loss Plan",
      nextDelivery: "2023-06-15T09:00:00",
      mealsPerDay: 3,
      daysPerWeek: 5,
    },
    upcomingDeliveries: [
      {
        id: "del-1",
        date: "2023-06-15T09:00:00",
        status: "scheduled",
        items: 5,
      },
      {
        id: "del-2",
        date: "2023-06-22T09:00:00",
        status: "scheduled",
        items: 5,
      },
    ],
    recentOrders: [
      {
        id: "ord-1",
        date: "2023-06-01T14:30:00",
        status: "delivered",
        total: 349,
        items: 3,
      },
      {
        id: "ord-2",
        date: "2023-05-15T10:15:00",
        status: "delivered",
        total: 249,
        items: 2,
      },
    ],
    nutritionSummary: {
      caloriesAvg: 1850,
      proteinAvg: 120,
      carbsAvg: 150,
      fatAvg: 60,
    },
  }

  // Use mock data for now, replace with actual data when available
  const data = dashboardData || mockData

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name?.split(" ")[0] || "User"}</h1>
          <p className="text-gray-600">Here's an overview of your meal plans and orders</p>
        </div>
        <div className="flex gap-2">
          <Link href="/meal-plans">
            <Button className="bg-green-600 hover:bg-green-700">Browse Meal Plans</Button>
          </Link>
          <Link href="/express-shop">
            <Button variant="outline">Express Shop</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Active Meal Plan</h3>
            <p className="text-3xl font-bold">{data.activeMealPlan ? "1" : "0"}</p>
            <Link href="/dashboard/meal-plans" className="mt-2 text-sm text-green-600 hover:underline">
              View details
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="mb-4 rounded-full bg-blue-100 p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium">Upcoming Deliveries</h3>
            <p className="text-3xl font-bold">{data.upcomingDeliveries?.length || 0}</p>
            <Link href="/dashboard/schedule" className="mt-2 text-sm text-blue-600 hover:underline">
              View schedule
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="mb-4 rounded-full bg-purple-100 p-3">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium">Total Orders</h3>
            <p className="text-3xl font-bold">{data.recentOrders?.length || 0}</p>
            <Link href="/dashboard/orders" className="mt-2 text-sm text-purple-600 hover:underline">
              Order history
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="mb-4 rounded-full bg-orange-100 p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium">Avg. Daily Calories</h3>
            <p className="text-3xl font-bold">{data.nutritionSummary?.caloriesAvg || "N/A"}</p>
            <Link href="/dashboard/nutrition" className="mt-2 text-sm text-orange-600 hover:underline">
              Nutrition stats
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="meal-plan">
          <TabsList className="mb-4">
            <TabsTrigger value="meal-plan">Active Meal Plan</TabsTrigger>
            <TabsTrigger value="deliveries">Upcoming Deliveries</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="meal-plan">
            {data.activeMealPlan ? (
              <Card>
                <CardHeader>
                  <CardTitle>Your Active Meal Plan</CardTitle>
                  <CardDescription>Details of your current subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-500">Plan Type</h4>
                        <p className="text-lg font-medium">{data.activeMealPlan.name}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-500">Next Delivery</h4>
                        <p className="text-lg font-medium">{formatDate(data.activeMealPlan.nextDelivery)}</p>
                        <p className="text-sm text-gray-500">{formatTime(data.activeMealPlan.nextDelivery)}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-500">Meals Per Day</h4>
                        <p className="text-lg font-medium">{data.activeMealPlan.mealsPerDay}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-500">Days Per Week</h4>
                        <p className="text-lg font-medium">{data.activeMealPlan.daysPerWeek}</p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Link href="/dashboard/meal-plans">
                        <Button variant="outline">View Details</Button>
                      </Link>
                      <Link href="/meal-customization">
                        <Button className="bg-green-600 hover:bg-green-700">Customize Meals</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center p-12 text-center">
                  <Package className="mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-xl font-medium">No Active Meal Plan</h3>
                  <p className="mb-6 text-gray-500">
                    You don't have any active meal plan subscription. Browse our meal plans to get started.
                  </p>
                  <Link href="/meal-plans">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Browse Meal Plans <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="deliveries">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deliveries</CardTitle>
                <CardDescription>Your scheduled meal deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                {data.upcomingDeliveries && data.upcomingDeliveries.length > 0 ? (
                  <div className="space-y-4">
                    {data.upcomingDeliveries.map((delivery: any) => (
                      <div key={delivery.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full bg-blue-100 p-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{formatDate(delivery.date)}</p>
                            <p className="text-sm text-gray-500">{formatTime(delivery.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">{delivery.items} meals</p>
                            <p className="text-sm text-gray-500">
                              {delivery.status === "scheduled" ? "Scheduled" : "Processing"}
                            </p>
                          </div>
                          <Link href={`/dashboard/schedule/${delivery.id}`}>
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <Link href="/dashboard/schedule">
                        <Button variant="outline">
                          View All Deliveries <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-6 text-center">
                    <Calendar className="mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-xl font-medium">No Upcoming Deliveries</h3>
                    <p className="text-gray-500">
                      You don't have any scheduled deliveries. Subscribe to a meal plan to get started.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your order history</CardDescription>
              </CardHeader>
              <CardContent>
                {data.recentOrders && data.recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {data.recentOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full bg-green-100 p-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">{order.total} MAD</p>
                            <p className="text-sm text-gray-500">{order.items} items</p>
                          </div>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <Link href="/dashboard/orders">
                        <Button variant="outline">
                          View Order History <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-6 text-center">
                    <ShoppingBag className="mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-xl font-medium">No Orders Yet</h3>
                    <p className="text-gray-500">
                      You haven't placed any orders yet. Browse our meal plans or express shop to get started.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
