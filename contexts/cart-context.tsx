/**
 * Cart Context
 * Provides cart state and actions for the Express Shop with sessionStorage persistence.
 * No API integration - UI only.
 */

"use client"

import React, { createContext, useContext, useCallback, useEffect, useState } from "react"
import type { CartItem } from "@/types/cart.types"

const CART_STORAGE_KEY = "fitnest_cart"

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartCount: () => number
  getSubtotal: () => number
}

const CartContext = createContext<CartContextValue | null>(null)

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.error("Failed to save cart to sessionStorage:", e)
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(loadFromStorage())
  }, [])

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = item.quantity ?? 1
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId)
        let next: CartItem[]
        if (existing) {
          next = prev.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i
          )
        } else {
          next = [...prev, { ...item, quantity: qty }]
        }
        saveToStorage(next)
        return next
      })
    },
    []
  )

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.productId !== productId)
      saveToStorage(next)
      return next
    })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const next = prev.filter((i) => i.productId !== productId)
        saveToStorage(next)
        return next
      }
      const next = prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
      saveToStorage(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    saveToStorage([])
  }, [])

  const getCartCount = useCallback(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0)
  }, [items])

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  }, [items])

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartCount,
    getSubtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return ctx
}
