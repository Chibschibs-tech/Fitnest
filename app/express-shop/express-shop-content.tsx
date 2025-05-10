"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShoppingCart, Plus, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: number
  name: string
  description: string
  price: number
  salePrice?: number
  imageUrl?: string
  category: string
  tags?: string
  nutritionalInfo?: any
  stock: number
}

export function ExpressShopContent() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Extract unique categories from products
  const categories = ["all", ...new Set(products.map((product) => product.category))]

  const filteredProducts =
    activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory)

  const handleAddToCart = async (productId: number) => {
    setAddingToCart(productId)
    try {
      await addItem(productId, 1)
    } finally {
      setAddingToCart(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Express Shop</h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          Browse our selection of healthy snacks, protein bars, and more for quick delivery.
        </p>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <div className="flex items-center justify-between">
          <TabsList className="overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category.replace("_", " ")}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant="outline" size="sm" className="ml-4">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            {filteredProducts.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center space-y-4 text-center">
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm text-gray-500">Try selecting a different category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <Link href={`/express-shop/${product.id}`}>
                      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                        {product.salePrice && <Badge className="absolute right-2 top-2 bg-green-600">Sale</Badge>}
                      </div>
                    </Link>
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          {product.salePrice ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-green-600">{product.salePrice} MAD</span>
                              <span className="text-sm text-gray-500 line-through">{product.price} MAD</span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold">{product.price} MAD</span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {product.category.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingToCart === product.id}
                      >
                        {addingToCart === product.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
