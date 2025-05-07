"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { siteConfig } from "@/lib/constants"

export function LogoutButton({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch(`${siteConfig.apiUrl}/api/auth/logout`, {
        method: "POST",
      })

      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <button onClick={handleLogout} className="text-sm font-medium text-gray-700 hover:text-gray-900">
      {children}
    </button>
  )
}
