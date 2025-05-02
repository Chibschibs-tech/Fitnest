"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function NavbarAuth() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/logout") // Fallback to our custom logout page
    }
  }

  // Don't render anything on the server or before mounting
  if (!mounted) {
    return null
  }

  if (status === "loading") {
    return null
  }

  if (status === "authenticated" && session) {
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
