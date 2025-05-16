"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AddToCartButtonProps {
  productId: number
  className?: string
}

export function AddToCartButton({ productId, className = "" }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const { toast } = useToast()

  const addToCart = async () => {
    try {
      setLoading(true)

      // First ensure cart table exists
      await fetch("/api/ensure-cart-table")

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      setAdded(true)
      setTimeout(() => setAdded(false), 2000)

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={addToCart} disabled={loading} className={className}>
      {added ? <Check className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
      {added ? "Added!" : "Add to Cart"}
    </Button>
  )
}
