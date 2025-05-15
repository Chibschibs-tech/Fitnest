"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "@/components/ui/use-toast"

interface CartActionsProps {
  itemId: number
  initialQuantity: number
}

export function CartActions({ itemId, initialQuantity }: CartActionsProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return
    if (isUpdating || isRemoving) return

    setIsUpdating(true)

    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          quantity: newQuantity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update cart")
      }

      setQuantity(newQuantity)

      // Refresh the page to show updated cart
      router.refresh()

      // Dispatch event to update cart count
      window.dispatchEvent(new Event("cart:updated"))
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update cart",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async () => {
    if (isUpdating || isRemoving) return

    setIsRemoving(true)

    try {
      const response = await fetch(`/api/cart?id=${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to remove item")
      }

      // Refresh the page to show updated cart
      router.refresh()

      // Dispatch event to update cart count
      window.dispatchEvent(new Event("cart:updated"))

      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove item",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center rounded-md border">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-r-none"
          onClick={() => updateQuantity(quantity - 1)}
          disabled={quantity <= 1 || isUpdating || isRemoving}
        >
          <Minus className="h-3 w-3" />
          <span className="sr-only">Decrease quantity</span>
        </Button>
        <div className="flex h-8 w-8 items-center justify-center text-sm">
          {isUpdating ? <LoadingSpinner size="sm" /> : quantity}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-l-none"
          onClick={() => updateQuantity(quantity + 1)}
          disabled={quantity >= 99 || isUpdating || isRemoving}
        >
          <Plus className="h-3 w-3" />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
        onClick={removeItem}
        disabled={isUpdating || isRemoving}
      >
        {isRemoving ? <LoadingSpinner size="sm" /> : <Trash2 className="h-4 w-4" />}
        <span className="sr-only">Remove item</span>
      </Button>
    </div>
  )
}
