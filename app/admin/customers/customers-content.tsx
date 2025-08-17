"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Users, UserCheck, DollarSign, TrendingUp, RefreshCw, Eye } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  total_orders: number
  total_spent: number
  last_order_date: string | null
  status: "active" | "inactive"
  created_at: string
}

interface CustomerMetrics {
  totalCustomers: number
  activeCustomers: number
  totalRevenue: number
  avgOrderValue: number
}

export default function CustomersContent() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [metrics, setMetrics] = useState<CustomerMetrics>({
    totalCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/admin/customers")
      const data = await response.json()

      if (data.success) {
        setCustomers(data.customers || [])
        setMetrics(
          data.metrics || {
            totalCustomers: 0,
            activeCustomers: 0,
            totalRevenue: 0,
            avgOrderValue: 0,
          },
        )
      } else {
        setError(data.error || "Failed to fetch customers")
        setCustomers([])
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
      setError("Failed to fetch customers")
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} MAD`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString()
  }

  const handleViewDetails = (customerId: string) => {
    router.push(`/admin/customers/${customerId}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground">Manage your customers and their orders</p>
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
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage your customers and their orders</p>
        </div>
        <Button onClick={fetchCustomers} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchCustomers} variant="outline" size="sm">
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
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.activeCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.avgOrderValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your customer base and view their order history</p>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "No customers found matching your criteria." : "No customers found."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Contact</th>
                    <th className="text-left py-3 px-4 font-medium">Orders</th>
                    <th className="text-left py-3 px-4 font-medium">Total Spent</th>
                    <th className="text-left py-3 px-4 font-medium">Last Order</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{customer.name || "Unknown"}</div>
                          <div className="text-sm text-muted-foreground">ID: {customer.id}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{customer.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{customer.total_orders}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{formatCurrency(Number(customer.total_spent))}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{formatDate(customer.last_order_date)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(customer.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
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
