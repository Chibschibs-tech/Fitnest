"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-simple-auth"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        router.push("/")
      } catch (error) {
        console.error("Logout error:", error)
        // Fallback manual logout - clear custom session cookie
        document.cookie = "session-id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
        router.push("/")
      }
    }

    performLogout()
  }, [router, logout])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Logging out...</h1>
        <p className="mt-2 text-gray-600">Please wait while we log you out.</p>
      </div>
    </div>
  )
}
