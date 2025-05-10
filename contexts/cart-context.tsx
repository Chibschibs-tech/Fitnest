"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

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

interface CartItem {
  id: number
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  subtotal: number
  itemCount: number
  isLoading: boolean
  addItem: (productId: number, quantity: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calculate subtotal and item count
  const subtotal = items.reduce(
    (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity,
    0,
  )
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  // Fetch cart items on initial load
  useEffect(() => {
    if (!isClient) return

    async function fetchCartItems() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/cart")
        if (!response.ok) {
          throw new Error("Failed to fetch cart items")
        }
        const data = await response.json()
        setItems(data)
      } catch (err) {
        console.error("Error fetching cart items:", err)
        // Initialize with empty cart on error
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartItems()
  }, [isClient])

  // Add item to cart
  const addItem = useCallback(async (productId: number, quantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to cart")
      }

      const data = await response.json()
      setItems(data)
    } catch (err) {
      console.error("Error adding item to cart:", err)
      throw err
    }
  }, [])

  // Update item quantity
  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to update item quantity")
      }

      const data = await response.json()
      setItems(data)
    } catch (err) {
      console.error("Error updating item quantity:", err)
      throw err
    }
  }, [])

  // Remove item from cart
  const removeItem = useCallback(async (itemId: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item from cart")
      }

      const data = await response.json()
      setItems(data)
    } catch (err) {
      console.error("Error removing item from cart:", err)
      throw err
    }
  }, [])

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to clear cart")
      }

      setItems([])
    } catch (err) {
      console.error("Error clearing cart:", err)
      throw err
    }
  }, [])

  // Only provide the context if we're on the client side
  if (!isClient) {
    return <>{children}</>
  }

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        itemCount,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined"

  if (!context && isBrowser) {
    throw new Error("useCart must be used within a CartProvider")
  }

  // Return a default value when not in browser to prevent SSR errors
  if (!isBrowser) {
    return {
      items: [],
      subtotal: 0,
      itemCount: 0,
      isLoading: true,
      addItem: async () => {},
      updateQuantity: async () => {},
      removeItem: async () => {},
      clearCart: async () => {},
    }
  }

  return context!
}
