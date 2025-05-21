"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"

export function CartIcon() {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { status } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    // Reset error state on path change
    setError(null)

    // Only fetch cart count if user is authenticated
    if (status === "authenticated") {
      fetchCartCount()
    } else if (status === "unauthenticated") {
      setCount(0)
      setIsLoading(false)
    }
  }, [status, pathname])

  const fetchCartCount = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/cart/count", {
        // Add cache control headers
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCount(data.count || 0)
      } else {
        console.error("Failed to fetch cart count")
        setError("Failed to fetch cart count")
        setCount(0)
      }
    } catch (error) {
      console.error("Error fetching cart count:", error)
      setError("Error fetching cart count")
      setCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  // If there's an error, don't show the count badge
  if (error) {
    return (
      <Link href="/cart" className="relative">
        <ShoppingCart className="h-6 w-6" />
      </Link>
    )
  }

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {!isLoading && count > 0 && (
        <Badge
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2B7A0B] p-0 text-xs text-white"
          variant="default"
        >
          {count}
        </Badge>
      )}
    </Link>
  )
}
