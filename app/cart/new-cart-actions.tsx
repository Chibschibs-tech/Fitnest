"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Minus, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface CartItem {
  id: string
  product_id: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    image?: string
  }
}

interface NewCartActionsProps {
  item: CartItem
}

export default function NewCartActions({ item }: NewCartActionsProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const { toast } = useToast()

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity === item.quantity) return
    if (newQuantity < 1) return

    setIsUpdating(true)
    console.log("Updating quantity to:", newQuantity, "for product:", item.product_id)

    try {
      const response = await fetch(`/api/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.product_id,
          quantity: newQuantity,
        }),
      })

      console.log("Update response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Update failed:", errorData)
        throw new Error(errorData.error || "Failed to update cart")
      }

      const result = await response.json()
      console.log("Update success:", result)

      toast({
        title: "Cart updated",
        description: "Item quantity has been updated",
      })

      // Force page refresh to show changes
      window.location.reload()
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update cart. Please try again.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async () => {
    setIsRemoving(true)
    console.log("Removing product:", item.product_id)

    try {
      const response = await fetch(`/api/cart?id=${item.product_id}`, {
        method: "DELETE",
      })

      console.log("Remove response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Remove failed:", errorData)
        throw new Error(errorData.error || "Failed to remove item from cart")
      }

      const result = await response.json()
      console.log("Remove success:", result)

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })

      // Refresh the page to show updated cart
      window.location.reload()
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item. Please try again.",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-r-none"
          onClick={() => updateQuantity(quantity - 1)}
          disabled={isUpdating || isRemoving || quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          onBlur={() => updateQuantity(quantity)}
          className="h-8 w-16 rounded-none text-center"
          disabled={isUpdating || isRemoving}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-l-none"
          onClick={() => updateQuantity(quantity + 1)}
          disabled={isUpdating || isRemoving}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
        onClick={removeItem}
        disabled={isRemoving}
      >
        {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
