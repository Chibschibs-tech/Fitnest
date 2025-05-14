"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/cart-context"

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

interface ProductDetailContentProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetailContent({ product, relatedProducts }: ProductDetailContentProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { toast } = useToast()

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleAddToCart = async () => {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/express-shop/${product.id}`)
      return
    }

    setIsAddingToCart(true)
    try {
      await addItem(product.id, quantity)

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Parse nutritional info if available
  const nutritionalInfo = product.nutritionalInfo ? product.nutritionalInfo : null

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6 flex items-center text-gray-600" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </Button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingCart className="h-24 w-24 text-gray-300" />
            </div>
          )}
          {product.salePrice && <Badge className="absolute right-4 top-4 bg-green-600 px-3 py-1 text-base">Sale</Badge>}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Badge variant="outline" className="mt-2">
              {product.category.replace("_", " ")}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-green-600">{product.salePrice} MAD</span>
                  <span className="text-lg text-gray-500 line-through">{product.price} MAD</span>
                </>
              ) : (
                <span className="text-2xl font-bold">{product.price} MAD</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Quantity</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full py-6 text-lg"
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock <= 0 || status !== "authenticated"}
          >
            {isAddingToCart ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-5 w-5" />
            )}
            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>

          {/* Nutritional Information */}
          {nutritionalInfo && (
            <div className="mt-8 rounded-lg border p-4">
              <h3 className="mb-4 text-lg font-medium">Nutritional Information</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-md bg-gray-50 p-3 text-center">
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="text-lg font-bold">{nutritionalInfo.calories || "N/A"}</p>
                </div>
                <div className="rounded-md bg-gray-50 p-3 text-center">
                  <p className="text-sm text-gray-500">Protein</p>
                  <p className="text-lg font-bold">{nutritionalInfo.protein || "N/A"}g</p>
                </div>
                <div className="rounded-md bg-gray-50 p-3 text-center">
                  <p className="text-sm text-gray-500">Carbs</p>
                  <p className="text-lg font-bold">{nutritionalInfo.carbs || "N/A"}g</p>
                </div>
                <div className="rounded-md bg-gray-50 p-3 text-center">
                  <p className="text-sm text-gray-500">Fat</p>
                  <p className="text-lg font-bold">{nutritionalInfo.fat || "N/A"}g</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">You might also like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts
              .filter((relatedProduct) => relatedProduct.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden">
                  <Link href={`/express-shop/${relatedProduct.id}`}>
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      {relatedProduct.imageUrl ? (
                        <Image
                          src={relatedProduct.imageUrl || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingCart className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      {relatedProduct.salePrice && <Badge className="absolute right-2 top-2 bg-green-600">Sale</Badge>}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <h3 className="line-clamp-1 text-lg font-medium">{relatedProduct.name}</h3>
                    <p className="line-clamp-2 text-sm text-gray-500">{relatedProduct.description}</p>
                    <div className="mt-2">
                      {relatedProduct.salePrice ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-green-600">{relatedProduct.salePrice} MAD</span>
                          <span className="text-sm text-gray-500 line-through">{relatedProduct.price} MAD</span>
                        </div>
                      ) : (
                        <span className="font-bold">{relatedProduct.price} MAD</span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/express-shop/${relatedProduct.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Product
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
