import { sql, db } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowLeft, Star } from "lucide-react"
import { AddToCart } from "./add-to-cart"

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

async function getProduct(id: string): Promise<Product | null> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
  
  try {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Handle different API response structures
    // API returns { data: { ...product } }
    const product = data.data || data
    
    if (!product) {
      return null
    }
    
    return product as Product
  } catch (error) {
    console.error('Failed to fetch product:', error)
    throw error
  }
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = params

  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/express-shop" className="mb-8 flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Link>
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.image ? (
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
                <ShoppingCart className="h-24 w-24 text-gray-300" />
            </div>
          )}
          {product.price?.base > product.price?.discount && (
            <Badge className="absolute right-4 top-4 bg-fitnest-green px-3 py-1 text-base">Sale</Badge>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Badge variant="outline" className="mt-2">
              {product.category?.name || "Uncategorized"}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {product.price?.discount > 0 && product.price?.base > product.price?.discount ? (
                <>
                  <span className="text-2xl font-bold text-fitnest-green">{product.price.discount} MAD</span>
                  <span className="text-lg text-gray-500 line-through">{product.price.base} MAD</span>
                </>
              ) : (
                <span className="text-2xl font-bold">{product.price?.base || 0} MAD</span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {product.stock_quantity > 0 ? `${product.stock_quantity} available` : "Out of stock"}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mt-8">
            <AddToCart productId={product.id} stock={product.stock_quantity} name={product.name} />
          </div>
        </div>
      </div>
    </div>
  )
}