"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Mail, Phone } from "lucide-react"

interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  acquisitionSource: string
  createdAt: string
  totalOrders: number
  activeOrders: number
  totalSpent: number
  lastOrderDate?: string
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
          <p className="text-2xl font-bold text-green-600">{customers.filter((c) => c.activeOrders > 0).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(customers.reduce((sum, c) => sum + Number(c.totalSpent), 0))}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Avg. Order Value</h3>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(
              customers.reduce((sum, c) => sum + Number(c.totalSpent), 0) /
                Math.max(
                  customers.reduce((sum, c) => sum + c.totalOrders, 0),
                  1,
                ),
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-500">ID: {customer.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="h-3 w-3 mr-1" />
                      {customer.email}
                    </div>
                    {customer.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-3 w-3 mr-1" />
                        {customer.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{customer.acquisitionSource}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{customer.totalOrders} total</div>
                    <div className="text-sm text-gray-500">{customer.activeOrders} active</div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(Number(customer.totalSpent))}</TableCell>
                <TableCell>{customer.lastOrderDate ? formatDate(customer.lastOrderDate) : "Never"}</TableCell>
                <TableCell>
                  <Badge variant={customer.activeOrders > 0 ? "default" : "secondary"}>
                    {customer.activeOrders > 0 ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
