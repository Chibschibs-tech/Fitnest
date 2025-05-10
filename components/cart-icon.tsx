"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch cart count on mount and set up interval to refresh
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch("/api/cart/count")
        if (response.ok) {
          const data = await response.json()
          setItemCount(data.count)
        }
      } catch (error) {
        console.error("Error fetching cart count:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartCount()

    // Set up interval to refresh cart count every 30 seconds
    const interval = setInterval(fetchCartCount, 30000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <Link href="/shopping-cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {!isLoading && itemCount > 0 && (
          <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-600">
            {itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
