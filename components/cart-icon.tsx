"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function CartIcon() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart/count")
      const data = await response.json()
      setCount(data.count || 0)
    } catch (error) {
      console.error("Error fetching cart count:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCartCount()

    // Listen for cart updates with backup event
    const handleCartUpdate = () => {
      fetchCartCount()
    }

    // Listen for both event types
    window.addEventListener("cart:updated", handleCartUpdate)
    window.addEventListener("cartModified", handleCartUpdate) // backup listener

    return () => {
      window.removeEventListener("cart:updated", handleCartUpdate)
      window.removeEventListener("cartModified", handleCartUpdate)
    }
  }, [])

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
