"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export default function NavbarAuth() {
  const { user, loading, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await logout()
  }

  // Don't render anything on the server or before mounting
  if (!mounted) {
    return null
  }

  if (loading) {
    return null
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/login">
        <Button variant="ghost">Login</Button>
      </Link>
      <Link href="/register">
        <Button>Sign Up</Button>
      </Link>
    </div>
  )
}

// Also export as named export for compatibility
export { NavbarAuth }
