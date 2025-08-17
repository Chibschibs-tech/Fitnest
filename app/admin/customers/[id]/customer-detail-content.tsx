"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ArrowLeft, User, Mail, ShoppingBag, DollarSign, TrendingUp, Settings, Bell, Utensils } from "lucide-react"

interface CustomerDetailContentProps {
  customerId: string
}

interface Customer {
  id: number
  name: string
  email: string
  role: string
  acquisition_source: string
  created_at: string
  updated_at: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: string | null
  orders: Array<{
    id: number
    status: string
    total: number
    created_at: string
  }>
  mealPreferences: any
  notificationPreferences: any
}

export function CustomerDetailContent({ customerId }: CustomerDetailContentProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCustomerDetails() {
      try {
        const response = await fetch(`/api/admin/customers/${customerId}`)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch customer details`)
        }

        const data = await response.json()

        if (data.success) {
          setCustomer(data.customer)
        } else {
          throw new Error(data.error || "Failed to fetch customer details")
        }
      } catch (error) {
        console.error("Error loading customer details:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerDetails()
  }, [customerId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { color: "bg-green-100 text-green-800", text: "Active" },
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
      completed: { color: "bg-blue-100 text-blue-800", text: "Completed" },
    }

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending
    return <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link href="/admin/customers" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Link>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Customer</h3>
              <p className="text-red-700">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <Link href="/admin/customers" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Link>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Customer Not Found</h3>
              <p className="text-gray-600">The customer you're looking for doesn't exist or has been deleted.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/admin/customers" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Link>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Edit Customer
          </Button>
        </div>
      </div>

      {/* Customer Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{customer.name}</CardTitle>
                  <CardDescription className="text-base">{customer.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer Since</p>
                  <p className="font-medium">{formatDate(customer.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Acquisition Source</p>
                  <p className="font-medium capitalize">{customer.acquisition_source || "Direct"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(customer.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{customer.totalOrders}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{formatPrice(customer.totalSpent)}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{formatPrice(customer.averageOrderValue)}</p>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from this customer</CardDescription>
        </CardHeader>
        <CardContent>
          {customer.orders.length > 0 ? (
            <div className="space-y-4">
              {customer.orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-sm text-gray-500">This customer hasn't placed any orders.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="mr-2 h-5 w-5" />
              Meal Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customer.mealPreferences ? (
              <div className="space-y-3">
                {customer.mealPreferences.dietary_restrictions && (
                  <div>
                    <p className="text-sm font-medium">Dietary Restrictions</p>
                    <p className="text-sm text-gray-600">{customer.mealPreferences.dietary_restrictions}</p>
                  </div>
                )}
                {customer.mealPreferences.allergies && (
                  <div>
                    <p className="text-sm font-medium">Allergies</p>
                    <p className="text-sm text-gray-600">{customer.mealPreferences.allergies}</p>
                  </div>
                )}
                {customer.mealPreferences.preferred_cuisines && (
                  <div>
                    <p className="text-sm font-medium">Preferred Cuisines</p>
                    <p className="text-sm text-gray-600">{customer.mealPreferences.preferred_cuisines}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No meal preferences set</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customer.notificationPreferences ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <Badge variant={customer.notificationPreferences.email_notifications ? "default" : "secondary"}>
                    {customer.notificationPreferences.email_notifications ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">SMS Notifications</span>
                  <Badge variant={customer.notificationPreferences.sms_notifications ? "default" : "secondary"}>
                    {customer.notificationPreferences.sms_notifications ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <Badge variant={customer.notificationPreferences.push_notifications ? "default" : "secondary"}>
                    {customer.notificationPreferences.push_notifications ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Default notification settings</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
