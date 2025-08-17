"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Calendar, Package, User } from "lucide-react"
import Link from "next/link"

interface Customer {
  id: number
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

interface Order {
  id: number
  status: string
  total_amount: number
  created_at: string
  meal_plan_name?: string
}

interface CustomerDetailProps {
  customerId: string
}

export default function CustomerDetailContent({ customerId }: CustomerDetailProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCustomerDetails()
  }, [customerId])

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/customers/${customerId}`)
      const data = await response.json()

      if (data.success) {
        setCustomer(data.customer)
        setOrders(data.orders || [])
        setError("")
      } else {
        setError(data.error || "Failed to fetch customer details")
      }
    } catch (err) {
      setError("Failed to fetch customer details")
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading customer details...</div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/customers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-800">{error || "Customer not found"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/customers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600">Customer Details</p>
          </div>
        </div>
        <Button onClick={fetchCustomerDetails} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold">{customer.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p>{customer.email}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <Badge variant="secondary">{customer.role}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p>{new Date(customer.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Total Orders</label>
              <p className="text-2xl font-bold text-green-600">{orders.length}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Total Spent</label>
              <p className="text-2xl font-bold">{totalSpent.toFixed(2)} MAD</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Average Order Value</label>
              <p className="text-lg font-semibold">
                {orders.length > 0 ? (totalSpent / orders.length).toFixed(2) : "0.00"} MAD
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle>Order History ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found for this customer.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.meal_plan_name || "Custom Order"}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                    <p className="text-lg font-semibold mt-1">{order.total_amount?.toFixed(2) || "0.00"} MAD</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
