"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function useAuth() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Invalid email or password")
        return false
      }

      if (result?.ok) {
        router.push("/dashboard")
        return true
      }

      return false
    } catch (error) {
      setError("An unexpected error occurred")
      return false
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/")
      return true
    } catch (error) {
      return false
    }
  }

  // If not mounted yet, return a safe placeholder
  if (!mounted) {
    return {
      session: null,
      status: "loading",
      login,
      logout,
      error: null,
      isAuthenticated: false,
    }
  }

  return {
    session,
    status,
    login,
    logout,
    error,
    isAuthenticated: status === "authenticated" && !!session,
  }
}
