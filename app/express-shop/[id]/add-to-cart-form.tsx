"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Minus, Plus, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Product {
  id: number
  name: string
  price: number
  salePrice: number | null
  stock: number
}

export default function AddToCartForm({ product }: { product: Product }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isOutOfStock = product.stock <= 0
  const isAuthenticated = status === "authenticated"

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0 && value <= product.stock) {
      setQuantity(value)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleAddToCart = async () => {
    // Clear previous messages
    setError(null)
    setSuccess(null)

    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push(`/login?redirect=/express-shop/${product.id}`)
      return
    }

    // Check if product is in stock
    if (isOutOfStock) {
      setError("This product is out of stock")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add item to cart")
      }

      const result = await response.json()
      setSuccess(`${product.name} added to your cart`)

      // Refresh the cart count in the UI
      router.refresh()
    } catch (error) {
      console.error("Error adding to cart:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col space-y-4">
        {!isOutOfStock && (
          <div className="flex items-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decreaseQuantity}
              disabled={quantity <= 1 || isLoading}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
              className="mx-2 h-10 w-20 text-center"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={increaseQuantity}
              disabled={quantity >= product.stock || isLoading}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className="w-full bg-[#2B7A0B] hover:bg-[#236209]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>

        {!isAuthenticated && (
          <p className="text-sm text-gray-500">
            You need to{" "}
            <a href={`/login?redirect=/express-shop/${product.id}`} className="text-[#2B7A0B] hover:underline">
              log in
            </a>{" "}
            to add items to your cart
          </p>
        )}
      </div>
    </div>
  )
}
