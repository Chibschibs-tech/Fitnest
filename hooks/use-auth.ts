"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Get session with error handling
  const sessionResult = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Enhanced login function with error handling
  const login = async (email: string, password: string) => {
    try {
      setAuthError(null)
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        console.error("Login error:", result.error)
        setAuthError("Invalid email or password")
        return false
      }

      if (result?.ok) {
        router.push("/dashboard")
        return true
      }

      return false
    } catch (error) {
      console.error("Login exception:", error)
      setAuthError("An unexpected error occurred")
      return false
    }
  }

  // Enhanced logout function
  const logout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/")
      return true
    } catch (error) {
      console.error("Logout error:", error)
      return false
    }
  }

  // If not mounted yet, return loading state
  if (!mounted) {
    return {
      session: null,
      status: "loading",
      login,
      logout,
      error: null,
    }
  }

  return {
    session: sessionResult.data,
    status: sessionResult.status,
    login,
    logout,
    error: authError,
  }
}
