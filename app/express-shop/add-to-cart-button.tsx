"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "@/components/ui/use-toast"

interface AddToCartButtonProps {
  productId: number
  className?: string
}

export function AddToCartButton({ productId, className = "" }: AddToCartButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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
          quantity: 1,
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
        description: "Item has been added to your cart",
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
    <Button
      onClick={addToCart}
      disabled={isLoading || isSuccess}
      className={`bg-green-600 text-white hover:bg-green-700 ${className}`}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Adding...
        </>
      ) : isSuccess ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
