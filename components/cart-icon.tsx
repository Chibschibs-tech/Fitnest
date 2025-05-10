"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

export default function CartIcon() {
  const [mounted, setMounted] = useState(false)
  const { itemCount } = useCart()

  // Only show the cart count after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Link href="/shopping-cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {mounted && itemCount > 0 && (
          <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-600">
            {itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
