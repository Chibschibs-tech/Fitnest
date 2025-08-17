"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, User, Mail, Calendar, Package } from "lucide-react"

interface Customer {
  id: number
  name: string
  email: string
  role: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  status: string
  createdAt: string
}

export default function CustomersContent() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/customers")
      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error fetching customers:", error)
      setError("Failed to load customers")
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
      case "customer":
        return <Badge className="bg-blue-100 text-blue-800">Customer</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading customers...</div>
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchCustomers}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{customers.filter((c) => c.status === "active").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <User className="h-8 w-8 text-gray-400" />
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {customer.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(customer.role)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {customer.totalOrders}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(customer.totalSpent)}</TableCell>
                <TableCell>
                  {customer.lastOrderDate ? (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-gray-400">No orders</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(customer.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No customers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "No customers have registered yet."}
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
