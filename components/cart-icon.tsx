"use client"

import { useState, useEffect, useCallback } from "react"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function CartIcon() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [forceUpdate, setForceUpdate] = useState(0) // Force re-render trigger

  const fetchCartCount = useCallback(async () => {
    try {
      console.log("Fetching cart count...")
      const response = await fetch("/api/cart/count", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      const data = await response.json()
      console.log("Cart count response:", data)

      const newCount = data.count || 0
      setCount(newCount)
      setForceUpdate((prev) => prev + 1) // Force component re-render
    } catch (error) {
      console.error("Error fetching cart count:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCartCount()

    const handleCartUpdate = () => {
      console.log("Cart update event received, fetching new count...")
      fetchCartCount()
    }

    // Listen for both event types
    window.addEventListener("cart:updated", handleCartUpdate)
    window.addEventListener("cartModified", handleCartUpdate)

    console.log("Cart icon event listeners added")

    return () => {
      window.removeEventListener("cart:updated", handleCartUpdate)
      window.removeEventListener("cartModified", handleCartUpdate)
    }
  }, [fetchCartCount])

  return (
    <Link href="/cart" className="relative" key={forceUpdate}>
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
