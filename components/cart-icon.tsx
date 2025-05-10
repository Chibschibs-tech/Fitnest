"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

export default function CartIcon() {
  const [count, setCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Fetch cart count on initial load
    fetchCartCount()

    // Set up interval to refresh cart count
    const interval = setInterval(fetchCartCount, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart/count")
      if (response.ok) {
        const data = await response.json()
        setCount(data.count)
      }
    } catch (error) {
      console.error("Error fetching cart count:", error)
    }
  }

  // Don't render anything on the server to prevent hydration mismatch
  if (!isClient) return null

  return (
    <Link href="/shopping-cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  )
}
