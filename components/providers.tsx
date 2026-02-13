"use client"

import type React from "react"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/contexts/cart-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  )
}
