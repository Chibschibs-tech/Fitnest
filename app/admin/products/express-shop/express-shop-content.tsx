"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Star, Eye, Edit, ShoppingCart } from "lucide-react"

interface ExpressProduct {
  id: number
  name: string
  description: string
  price: number
  category: string
  productType: string
  featured: boolean
  stock: number
  orders: number
  revenue: number
  active: boolean
  createdAt: string
}

export default function ExpressShopContent() {
  const [products, setProducts] = useState<ExpressProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExpressProducts()
  }, [])

  const fetchExpressProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/products/express-shop")
      if (!response.ok) {
        throw new Error("Failed to fetch express shop products")
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching express products:", error)
      setError("Failed to load express shop products")
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getProductTypeBadge = (type: string) => {
    const colors = {
      meal: "bg-green-100 text-green-800",
      snack: "bg-blue-100 text-blue-800",
      accessory: "bg-purple-100 text-purple-800",
      supplement: "bg-orange-100 text-orange-800",
      product: "bg-gray-100 text-gray-800",
    }
    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{type.toUpperCase()}</Badge>
    )
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading express shop products...</div>
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchExpressProducts}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{products.filter((p) => p.featured).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{products.filter((p) => p.stock > 0).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{products.reduce((sum, p) => sum + p.orders, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(products.reduce((sum, p) => sum + Number(p.price), 0) / Math.max(products.length, 1))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search express shop products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <ShoppingCart className="h-4 w-4 mr-2" />
            View Shop
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div>
                    <div className="font-medium flex items-center">
                      {product.featured && <Star className="h-4 w-4 text-yellow-500 mr-1" />}
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                  </div>
                </TableCell>
                <TableCell>{getProductTypeBadge(product.productType)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(Number(product.price))}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.stock}</div>
                    <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                      {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.orders}</TableCell>
                <TableCell className="font-medium">{formatCurrency(product.revenue)}</TableCell>
                <TableCell>
                  <Button variant={product.featured ? "default" : "outline"} size="sm">
                    <Star className={`h-4 w-4 mr-1 ${product.featured ? "fill-current" : ""}`} />
                    {product.featured ? "Featured" : "Feature"}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "No products are available in the express shop."}
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
