"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

export function CartIcon() {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch("/api/cart/count")

        if (response.ok) {
          const data = await response.json()
          setCount(data.count || 0)
        }
      } catch (error) {
        console.error("Error fetching cart count:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartCount()

    // Refresh cart count every 30 seconds
    const interval = setInterval(fetchCartCount, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />

      {!isLoading && count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  )
}

export default CartIcon
