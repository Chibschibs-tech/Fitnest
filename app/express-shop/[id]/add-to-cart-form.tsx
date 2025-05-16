"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "@/components/ui/use-toast"

interface AddToCartFormProps {
  productId: number
}

export function AddToCartForm({ productId }: AddToCartFormProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < 99) {
      setQuantity(quantity + 1)
    }
  }

  const addToCart = async () => {
    if (isLoading || isSuccess) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add item to cart")
      }

      // Show success state
      setIsSuccess(true)

      // Dispatch event to update cart count
      window.dispatchEvent(new Event("cart:updated"))

      // Show success toast
      toast({
        title: "Added to cart",
        description: `${quantity} item${quantity > 1 ? "s" : ""} added to your cart`,
      })

      // Reset success state after 2 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error adding to cart:", error)

      // Show error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add item to cart",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center rounded-md border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-r-none"
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || isLoading || isSuccess}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <div className="flex h-10 w-12 items-center justify-center text-center">{quantity}</div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-l-none"
            onClick={increaseQuantity}
            disabled={quantity >= 99 || isLoading || isSuccess}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
        <Button
          onClick={addToCart}
          disabled={isLoading || isSuccess}
          className="flex-1 bg-green-600 py-6 text-white hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Adding...
            </>
          ) : isSuccess ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
      <Button onClick={() => router.push("/cart")} variant="outline" className="w-full py-6">
        View Cart
      </Button>
    </div>
  )
}
