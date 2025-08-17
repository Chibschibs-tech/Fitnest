"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, ShoppingCart } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  role?: string
  status: "active" | "inactive"
  created_at: string
  updated_at?: string
}

interface Order {
  id: string
  total: number
  status: string
  created_at: string
  updated_at?: string
}

interface CustomerStats {
  totalOrders: number
  totalSpent: number
  avgOrderValue: number
  lastOrderDate: string | null
  firstOrderDate: string | null
}

interface CustomerDetailContentProps {
  customerId: string
}

export default function CustomerDetailContent({ customerId }: CustomerDetailContentProps) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<CustomerStats | null>(null)
  const [statusBreakdown, setStatusBreakdown] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/admin/customers/${customerId}`)
        const data = await response.json()

        if (data.success) {
          setCustomer(data.customer)
          setOrders(data.orders || [])
          setStats(data.stats)
          setStatusBreakdown(data.statusBreakdown || {})
        } else {
          setError(data.error || "Failed to fetch customer details")
        }
      } catch (error) {
        console.error("Error fetching customer details:", error)
        setError("Failed to fetch customer details")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerDetails()
  }, [customerId])

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} MAD`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading customer details...</p>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Error</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error || "Customer not found"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{customer.name || "Unknown Customer"}</h1>
          <p className="text-muted-foreground">Customer ID: {customer.id}</p>
        </div>
        <Badge variant={customer.status === "active" ? "default" : "secondary"} className="ml-auto">
          {customer.status}
        </Badge>
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
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{customer.address}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Joined {formatDate(customer.created_at)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalSpent)}</div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.avgOrderValue)}</div>
                  <div className="text-sm text-muted-foreground">Avg Order</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{formatDate(stats.lastOrderDate)}</div>
                  <div className="text-sm text-muted-foreground">Last Order</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Status Breakdown */}
      {Object.keys(statusBreakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {Object.entries(statusBreakdown).map(([status, count]) => (
                <div key={status} className="text-center">
                  <div className="text-lg font-bold">{count}</div>
                  <Badge variant="outline" className="text-xs">
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Order History ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found for this customer.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium">Total</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="font-medium">#{order.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{formatCurrency(order.total)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{formatDateTime(order.created_at)}</div>
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
