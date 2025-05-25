"use client"

import { useState, useEffect, useCallback } from "react"
import { ShoppingCart } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function CartIcon() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCartCount = useCallback(async () => {
    try {
      console.log("Fetching cart count...")
      const response = await fetch("/api/cart/count", {
        cache: 'no-store', // Ensure fresh data
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const data = await response.json()
      console.log("Cart count response:", data)
      setCount(data.count || 0)
    } catch (error) {
      console.error("Error fetching cart count:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCartCount()

    // Listen for cart updates with backup event
    const handleCartUpdate = () => {
      console.log("Cart update event received, fetching new count...")
      fetchCartCount()
    }

    // Listen for both event types
    window.addEventListener("cart:updated", handleCartUpdate)
    window.addEventListener("cartModified", handleCartUpdate)

    // Also listen for focus events as backup
    window.addEventListener("focus", handleCartUpdate)

    console.log("Cart icon event listeners added")

    return () => {
      window.removeEventListener("cart:updated", handleCartUpdate)
      window.removeEventListener("cartModified", handleCartUpdate)
      window.removeEventListener("focus", handleCartUpdate)
    }
  }, [fetchCartCount])

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {!loading && count > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
        >
          {count}
        </Badge>
      )}
    </Link>
  )
}
