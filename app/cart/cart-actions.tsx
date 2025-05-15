"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"

interface CartActionsProps {
  itemId: number
  initialQuantity: number
}

export function CartActions({ itemId, initialQuantity }: CartActionsProps) {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity === quantity || isUpdating) return

    setIsUpdating(true)
    setQuantity(newQuantity)

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
        // If update fails, revert to previous quantity
        setQuantity(initialQuantity)
      } else {
        // Refresh the page to show updated cart
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      setQuantity(initialQuantity)
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async () => {
    if (isRemoving) return

    setIsRemoving(true)

    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
        }),
      })

      if (response.ok) {
        // Refresh the page to show updated cart
        window.location.reload()
      }
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center rounded border border-gray-300">
        <button
          type="button"
          onClick={() => updateQuantity(quantity - 1)}
          disabled={quantity <= 1 || isUpdating}
          className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:text-gray-400"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button
          type="button"
          onClick={() => updateQuantity(quantity + 1)}
          disabled={isUpdating}
          className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:text-gray-400"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={removeItem}
        disabled={isRemoving}
        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
        aria-label="Remove item"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
