"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CartActions({ itemId }: { itemId: number }) {
  const [isRemoving, setIsRemoving] = useState(false)
  const router = useRouter()

  const removeItem = async () => {
    if (isRemoving) return

    setIsRemoving(true)

    try {
      const response = await fetch(`/api/cart?id=${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Refresh the page to show updated cart
        router.refresh()
      } else {
        console.error("Failed to remove item from cart")
      }
    } catch (error) {
      console.error("Error removing item from cart:", error)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <button
      onClick={removeItem}
      disabled={isRemoving}
      className="mt-2 text-sm text-red-600 hover:text-red-800 disabled:text-red-400"
    >
      {isRemoving ? "Removing..." : "Remove"}
    </button>
  )
}
