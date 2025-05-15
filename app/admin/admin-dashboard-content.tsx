"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AdminLayout } from "./admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ShoppingBag, Users, AlertCircle, ArrowRight, DollarSign, Calendar } from "lucide-react"

export function AdminDashboardContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/admin/dashboard")

        if (!response.ok) {
          throw new Error("Failed to load dashboard data")
        }

        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        setError("Failed to load dashboard information. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-medium text-red-800">Error Loading Dashboard</h3>
          <p className="text-red-700">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
        </div>
      </AdminLayout>
    )
  }

  // Mock data for demonstration
  const mockData = {
    stats: {
      totalOrders: 156,
      totalCustomers: 89,
      totalRevenue: 42850,
      pendingDeliveries: 23,
    },
    recentOrders: [
      {
        id: "ORD-12345",
        customer: "John Doe",
        date: "2023-06-01T14:30:00",
        status: "delivered",
        total: 349,
      },
      {
        id: "ORD-12346",
        customer: "Jane Smith",
        date: "2023-06-02T10:15:00",
        status: "processing",
        total: 249,
      },
      {
        id: "ORD-12347",
        customer: "Ahmed Hassan",
        date: "2023-06-03T09:45:00",
        status: "pending",
        total: 499,
      },
      {
        id: "ORD-12348",
        customer: "Sara Alami",
        date: "2023-06-04T16:20:00",
        status: "delivered",
        total: 199,
      },
      {
        id: "ORD-12349",
        customer: "Mohammed Tazi",
        date: "2023-06-05T11:30:00",
        status: "cancelled",
        total: 299,
      },
    ],
    topProducts: [
      {
        id: 1,
        name: "Protein Bar Pack",
        sales: 78,
        revenue: 4680,
      },
      {
        id: 2,
        name: "Energy Drink",
        sales: 65,
        revenue: 3250,
      },
      {
        id: 3,
        name: "Weight Loss Meal Plan",
        sales: 42,
        revenue: 14700,
      },
      {
        id: 4,
        name: "Protein Powder",
        sales: 36,
        revenue: 7200,
      },
      {
        id: 5,
        name: "Healthy Snack Box",
        sales: 29,
        revenue: 2900,
      },
    ],
    newCustomers: [
      {
        id: 1,
        name: "Fatima Zahra",
        email: "fatima@example.com",
        date: "2023-06-05T09:30:00",
      },
      {
        id: 2,
        name: "Youssef Amrani",
        email: "youssef@example.com",
        date: "2023-06-04T14:45:00",
      },
      {
        id: 3,
        name: "Leila Bennani",
        email: "leila@example.com",
        date: "2023-06-03T11:20:00",
      },
      {
        id: 4,
        name: "Karim Idrissi",
        email: "karim@example.com",
        date: "2023-06-02T16:10:00",
      },
      {
        id: 5,
        name: "Nadia Mansouri",
        email: "nadia@example.com",
        date: "2023-06-01T10:05:00",
      },
    ],
  }

  // Use mock data for now, replace with actual data when available
  const data = dashboardData || mockData

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the Fitnest.ma admin panel</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-3xl font-bold">{data.stats.totalOrders}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-3xl font-bold">{data.stats.totalCustomers}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(data.stats.totalRevenue)}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Deliveries</p>
              <p className="text-3xl font-bold">{data.stats.pendingDeliveries}</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="orders">
          <TabsList className="mb-4">
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
            <TabsTrigger value="customers">New Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm font-medium text-gray-500">
                        <th className="pb-3 pl-4">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentOrders.map((order: any) => (
                        <tr key={order.id} className="border-b text-sm">
                          <td className="py-4 pl-4 font-medium">{order.id}</td>
                          <td className="py-4">{order.customer}</td>
                          <td className="py-4">{formatDate(order.date)}</td>
                          <td className="py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4">{formatCurrency(order.total)}</td>
                          <td className="py-4 pr-4">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href="/admin/orders">
                    <Button variant="outline">
                      View All Orders <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best selling products by sales volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm font-medium text-gray-500">
                        <th className="pb-3 pl-4">Product Name</th>
                        <th className="pb-3">Sales</th>
                        <th className="pb-3">Revenue</th>
                        <th className="pb-3 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topProducts.map((product: any) => (
                        <tr key={product.id} className="border-b text-sm">
                          <td className="py-4 pl-4 font-medium">{product.name}</td>
                          <td className="py-4">{product.sales} units</td>
                          <td className="py-4">{formatCurrency(product.revenue)}</td>
                          <td className="py-4 pr-4">
                            <Link href={`/admin/products/${product.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href="/admin/products">
                    <Button variant="outline">
                      View All Products <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>New Customers</CardTitle>
                <CardDescription>Recently registered customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm font-medium text-gray-500">
                        <th className="pb-3 pl-4">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Joined</th>
                        <th className="pb-3 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.newCustomers.map((customer: any) => (
                        <tr key={customer.id} className="border-b text-sm">
                          <td className="py-4 pl-4 font-medium">{customer.name}</td>
                          <td className="py-4">{customer.email}</td>
                          <td className="py-4">{formatDate(customer.date)}</td>
                          <td className="py-4 pr-4">
                            <Link href={`/admin/customers/${customer.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href="/admin/customers">
                    <Button variant="outline">
                      View All Customers <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
