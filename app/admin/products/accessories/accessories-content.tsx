"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Eye, Trash2, Package } from "lucide-react"

interface Accessory {
  id: number
  name: string
  description: string
  price: number
  category: string
  color?: string
  size?: string
  stock: number
  active: boolean
  createdAt: string
}

export default function AccessoriesContent() {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAccessories()
  }, [])

  const fetchAccessories = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/products/accessories")
      if (!response.ok) {
        throw new Error("Failed to fetch accessories")
      }
      const data = await response.json()
      setAccessories(data)
    } catch (error) {
      console.error("Error fetching accessories:", error)
      setError("Failed to load accessories")
    } finally {
      setLoading(false)
    }
  }

  const filteredAccessories = accessories.filter(
    (accessory) =>
      accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      bag: "bg-blue-100 text-blue-800",
      bottle: "bg-green-100 text-green-800",
      apparel: "bg-purple-100 text-purple-800",
      equipment: "bg-orange-100 text-orange-800",
    }
    return (
      <Badge className={colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {category.toUpperCase()}
      </Badge>
    )
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
    if (stock < 5) return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
    return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading accessories...</div>
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchAccessories}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{accessories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{accessories.filter((a) => a.stock > 0).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{new Set(accessories.map((a) => a.category)).size}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(accessories.reduce((sum, a) => sum + Number(a.price) * a.stock, 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search accessories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Accessory
        </Button>
      </div>

      {/* Accessories Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccessories.map((accessory) => (
              <TableRow key={accessory.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{accessory.name}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">{accessory.description}</div>
                  </div>
                </TableCell>
                <TableCell>{getCategoryBadge(accessory.category)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {accessory.color && <div>Color: {accessory.color}</div>}
                    {accessory.size && <div>Size: {accessory.size}</div>}
                    {!accessory.color && !accessory.size && <span className="text-gray-400">No variants</span>}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(Number(accessory.price))}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{accessory.stock} units</div>
                    {getStockBadge(accessory.stock)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={accessory.active ? "default" : "secondary"}>
                    {accessory.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAccessories.length === 0 && (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No accessories found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "Start by adding your first accessory."}
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
