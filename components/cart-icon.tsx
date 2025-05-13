"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function CartIcon() {
  const [count, setCount] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)

    // Fetch cart count on initial load
    fetchCartCount()

    // Set up interval to refresh cart count
    const interval = setInterval(fetchCartCount, 30000) // Refresh every 30 seconds

    // Listen for custom events from add-to-cart actions
    window.addEventListener("cart:updated", fetchCartCount)

    return () => {
      clearInterval(interval)
      window.removeEventListener("cart:updated", fetchCartCount)
    }
  }, [])

  const fetchCartCount = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/cart/count")

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error fetching cart count:", errorText)
        setError("Failed to fetch cart count")
        return
      }

      const data = await response.json()
      console.log("Cart count:", data)

      if (data.error) {
        console.error("Cart count error:", data.error)
        setError(data.error)
        return
      }

      setCount(data.count || 0)
    } catch (error) {
      console.error("Error fetching cart count:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render anything on the server to prevent hydration mismatch
  if (!isClient) return null

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
