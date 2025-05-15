"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AdminLayout } from "../admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ShoppingBag, Search, CheckCircle, Clock, AlertTriangle, XCircle, Download, Plus } from "lucide-react"

interface Order {
  id: string
  customer: string
  email: string
  date: string
  status: "pending" | "processing" | "delivered" | "cancelled"
  total: number
  items: number
  type: "meal_plan" | "express_shop" | "mixed"
}

export function AdminOrdersContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ordersPerPage = 10

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/admin/orders")

        if (!response.ok) {
          throw new Error("Failed to load orders")
        }

        const data = await response.json()
        setOrders(data.orders || [])
        setTotalPages(Math.ceil((data.orders?.length || 0) / ordersPerPage))
      } catch (error) {
        console.error("Error loading orders:", error)
        setError("Failed to load orders. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  // Filter orders
  const filteredOrders = orders
    .filter((order) => {
      // Search filter
      if (
        searchQuery &&
        !order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false
      }

      // Type filter
      if (typeFilter !== "all" && order.type !== typeFilter) {
        return false
      }

      // Date filter
      if (dateFilter !== "all") {
        const orderDate = new Date(order.date)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const lastWeek = new Date(today)
        lastWeek.setDate(lastWeek.getDate() - 7)
        const lastMonth = new Date(today)
        lastMonth.setMonth(lastMonth.getMonth() - 1)

        if (
          (dateFilter === "today" && orderDate.toDateString() !== today.toDateString()) ||
          (dateFilter === "yesterday" && orderDate.toDateString() !== yesterday.toDateString()) ||
          (dateFilter === "last-week" && orderDate < lastWeek) ||
          (dateFilter === "last-month" && orderDate < lastMonth)
        ) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      // Sort by date or total
      if (sortBy === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === "total-desc") {
        return b.total - a.total
      } else if (sortBy === "total-asc") {
        return a.total - b.total
      } else if (sortBy === "customer-asc") {
        return a.customer.localeCompare(b.customer)
      } else {
        return b.customer.localeCompare(a.customer)
      }
    })

  // Paginate orders
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "processing":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-600" />
    }
  }

  // Get status text and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "delivered":
        return { text: "Delivered", color: "bg-green-100 text-green-800" }
      case "processing":
        return { text: "Processing", color: "bg-blue-100 text-blue-800" }
      case "pending":
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800" }
      case "cancelled":
        return { text: "Cancelled", color: "bg-red-100 text-red-800" }
      default:
        return { text: status, color: "bg-gray-100 text-gray-800" }
    }
  }

  // Get order type text
  const getOrderTypeText = (type: string) => {
    switch (type) {
      case "meal_plan":
        return "Meal Plan"
      case "express_shop":
        return "Express Shop"
      case "mixed":
        return "Mixed Order"
      default:
        return type
    }
  }

  // Mock data for demonstration
  const mockOrders: Order[] = Array.from({ length: 25 }, (_, i) => {
    const statuses = ["pending", "processing", "delivered", "cancelled"] as const
    const types = ["meal_plan", "express_shop", "mixed"] as const
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    const randomType = types[Math.floor(Math.random() * types.length)]
    const randomDate = new Date()
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30))

    return {
      id: `ORD-${12345 + i}`,
      customer: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      date: randomDate.toISOString(),
      status: randomStatus,
      total: Math.floor(Math.random() * 500) + 100,
      items: Math.floor(Math.random() * 5) + 1,
      type: randomType,
    }
  })

  // Use mock data for now, replace with actual data when available
  const displayOrders = orders.length > 0 ? paginatedOrders : mockOrders.slice(0, ordersPerPage)
  const totalFilteredOrders = orders.length > 0 ? filteredOrders.length : mockOrders.length

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4" />
            Create Order
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Order Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="meal_plan">Meal Plan</SelectItem>
                    <SelectItem value="express_shop">Express Shop</SelectItem>
                    <SelectItem value="mixed">Mixed Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="total-desc">Highest Amount</SelectItem>
                    <SelectItem value="total-asc">Lowest Amount</SelectItem>
                    <SelectItem value="customer-asc">Customer A-Z</SelectItem>
                    <SelectItem value="customer-desc">Customer Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>
            {totalFilteredOrders} order{totalFilteredOrders !== 1 ? "s" : ""} found
          </CardDescription>
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
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status)

                  return (
                    <tr key={order.id} className="border-b text-sm">
                      <td className="py-4 pl-4 font-medium">{order.id}</td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                        </div>
                      </td>
                      <td className="py-4">{formatDate(order.date)}</td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="py-4">{getOrderTypeText(order.type)}</td>
                      <td className="py-4">{order.items}</td>
                      <td className="py-4 font-medium">{formatCurrency(order.total)}</td>
                      <td className="py-4 pr-4">
                        <div className="flex space-x-2">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/admin/orders/${order.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber

                  if (totalPages <= 5) {
                    pageNumber = i + 1
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i
                  } else {
                    pageNumber = currentPage - 2 + i
                  }

                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(pageNumber)
                        }}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
