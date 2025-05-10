"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

interface Product {
  id: number
  name: string
  description: string
  price: number
  salePrice?: number
  imageUrl?: string
  category: string
  stock: number
}

interface CartItem {
  id: number
  productId: number
  quantity: number
  product: Product
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  isLoading: boolean
  addItem: (productId: number, quantity: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

// Default values for the context when not in a browser
const defaultCartContext: CartContextType = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  isLoading: false,
  addItem: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
}

const CartContext = createContext<CartContextType>(defaultCartContext)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch cart on initial load
  useEffect(() => {
    if (isBrowser) {
      refreshCart()
    }
  }, [])

  const refreshCart = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cart")

      if (!response.ok) {
        // If not authenticated or other error, initialize empty cart
        setItems([])
        setItemCount(0)
        setSubtotal(0)
        return
      }

      const data = await response.json()
      setItems(data.items)
      setItemCount(data.itemCount)
      setSubtotal(data.subtotal)
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your cart. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (productId: number, quantity: number) => {
    try {
      setIsLoading(true)
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

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      })

      await refreshCart()
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true)
      // Find the item to get its productId
      const item = items.find((i) => i.id === itemId)
      if (!item) return

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
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update cart. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart?id=${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item from cart")
      }

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })

      await refreshCart()
    } catch (error) {
      console.error("Error removing item from cart:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cart?clearAll=true", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to clear cart")
      }

      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared",
      })

      setItems([])
      setItemCount(0)
      setSubtotal(0)
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cart. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isLoading,
        addItem,
        updateQuantity,
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
  // If not in a browser, return default context
  if (!isBrowser) {
    return defaultCartContext
  }

  // Otherwise, use the context
  return useContext(CartContext)
}
