import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus } from "lucide-react"
import { CategoryFilter } from "./category-filter"
import { Suspense } from "react"

interface Product {
  id: string
  name: string
  description: string
  image: string
  category: {
    name: string
  }
  price: {
    base: number
    discount: number
  }
  quantity: number
  stock_quantity: number
}

async function getProducts(): Promise<Product[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
  
  try {
    const response = await fetch(`${API_BASE}/products?status=active`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Handle different API response structures
    return Array.isArray(data.data) ? data.data : data
  } catch (error) {
    console.error('Failed to fetch products:', error)
    // Return fallback data in case of error
    return []
  }
}

interface ExpressShopProps {
  searchParams: { category?: string }
}

export default async function ExpressShop({ searchParams }: ExpressShopProps) {
  const products = await getProducts()
  
  // Extract unique categories from products
  const uniqueCategories = Array.from(new Set(
    products
      .map((product) => product.category?.name || "uncategorized")
      .filter(Boolean)
  ))
  const categories = ["all", ...uniqueCategories]

  // Filter products based on selected category
  const selectedCategory = searchParams.category || "all"
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter((product) => (product.category?.name || "uncategorized") === selectedCategory)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Express Shop</h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          Browse our selection of healthy snacks, protein bars, and more for quick delivery.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <Suspense fallback={<div className="h-10 w-full rounded-md bg-muted animate-pulse" />}>
          <CategoryFilter categories={categories} activeCategory={selectedCategory} />
        </Suspense>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300" />
          <p className="text-lg font-medium text-gray-600">No products found</p>
          <p className="text-sm text-gray-500">
            {selectedCategory !== "all" 
              ? `Try selecting a different category` 
              : "No products available at the moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
              <Link href={`/express-shop/${product.id}`}>
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  {product.image ? (
                    <Image
                      src={product?.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  {product.price?.discount > 0 && product.price?.base > product.price?.discount && (
                    <Badge className="absolute right-2 top-2 bg-green-600">Sale</Badge>
                  )}
                </div>
              </Link>
              <CardHeader className="flex-shrink-0 p-4 pb-0">
                <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
                <CardDescription className="min-h-[2.5rem] line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-shrink-0 p-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    {product.price?.discount > 0 && product.price?.base > product.price?.discount ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-green-600">
                          {product.price.discount} MAD
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {product.price.base} MAD
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold">{product.price?.base || 0} MAD</span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="mt-auto p-4 pt-0">
                <Link href={`/express-shop/${product.id}`} className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    View Product
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
