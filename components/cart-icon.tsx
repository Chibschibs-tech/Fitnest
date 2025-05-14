"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"

export default function CartIcon() {
  const { status } = useSession()
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (status === "authenticated") {
      fetchCartCount()

      // Listen for cart update events
      window.addEventListener("cart:updated", fetchCartCount)

      return () => {
        window.removeEventListener("cart:updated", fetchCartCount)
      }
    } else {
      setIsLoading(false)
    }
  }, [status])

  const fetchCartCount = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cart/count")

      if (!response.ok) {
        throw new Error("Failed to fetch cart count")
      }

      const data = await response.json()
      setCount(data.count || 0)
    } catch (error) {
      console.error("Error fetching cart count:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render anything on the server to prevent hydration mismatch
  if (!isClient) return null

  // Don't render if not authenticated
  if (status !== "authenticated") return null

  return (
    <Link href="/shopping-cart" className="relative">
      <div className="relative flex items-center justify-center rounded-full p-1 transition-colors hover:bg-gray-100">
        <ShoppingCart className="h-6 w-6" />
        {isLoading ? (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200"></span>
        ) : count > 0 ? (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
          >
            {count}
          </Badge>
        ) : null}
      </div>
    </Link>
  )
}
