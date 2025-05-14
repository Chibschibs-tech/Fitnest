"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"

interface CartItem {
  id: number
  productId: number
  quantity: number
  product?: any
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  isLoading: boolean
  error: string | null
  addItem: (productId: number, quantity: number) => Promise<void>
  updateItem: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const session = useSession()
  const [items, setItems] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch cart data when session changes
  useEffect(() => {
    if (session.status === "authenticated") {
      refreshCart()
    } else if (session.status === "unauthenticated") {
      setItems([])
      setItemCount(0)
      setSubtotal(0)
      setIsLoading(false)
    }
  }, [session.status])

  const refreshCart = async () => {
    if (session.status !== "authenticated") return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/cart")

      if (!response.ok) {
        throw new Error("Failed to fetch cart")
      }

      const data = await response.json()

      setItems(data.items || [])
      setItemCount(data.items?.length || 0)
      setSubtotal(data.subtotal || 0)
    } catch (err) {
      console.error("Error fetching cart:", err)
      setError(err instanceof Error ? err.message : "Failed to load cart")
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (productId: number, quantity: number) => {
    if (session.status !== "authenticated") {
      throw new Error("You must be logged in to add items to your cart")
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add item to cart")
      }

      await refreshCart()

      // Trigger cart update event for other components
      window.dispatchEvent(new CustomEvent("cart:updated"))
    } catch (err) {
      console.error("Error adding item to cart:", err)
      throw err
    }
  }

  const updateItem = async (itemId: number, quantity: number) => {
    if (session.status !== "authenticated") return

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, quantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to update cart")
      }

      await refreshCart()

      // Trigger cart update event for other components
      window.dispatchEvent(new CustomEvent("cart:updated"))
    } catch (err) {
      console.error("Error updating cart:", err)
      throw err
    }
  }

  const removeItem = async (itemId: number) => {
    if (session.status !== "authenticated") return

    try {
      const response = await fetch(`/api/cart?id=${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item from cart")
      }

      await refreshCart()

      // Trigger cart update event for other components
      window.dispatchEvent(new CustomEvent("cart:updated"))
    } catch (err) {
      console.error("Error removing item from cart:", err)
      throw err
    }
  }

  const clearCart = async () => {
    if (session.status !== "authenticated") return

    try {
      const response = await fetch(`/api/cart?clearAll=true`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to clear cart")
      }

      await refreshCart()

      // Trigger cart update event for other components
      window.dispatchEvent(new CustomEvent("cart:updated"))
    } catch (err) {
      console.error("Error clearing cart:", err)
      throw err
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isLoading,
        error,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
