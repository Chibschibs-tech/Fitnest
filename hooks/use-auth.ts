"use client"

import { useContext, useState, useCallback } from "react"
import { AuthContext } from "@/components/auth-provider"

export function useAuth() {
  const context = useContext(AuthContext)
  const [error, setError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoggingIn(true)
      setError(null)

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          setError(data.message || "Login failed")
          return false
        }

        // Update the context with the user data
        if (context.setUser) {
          context.setUser(data.user)
        }

        // Refresh the page to apply the session
        window.location.href = "/dashboard"
        return true
      } catch (error) {
        console.error("Login error:", error)
        setError("An unexpected error occurred. Please try again.")
        return false
      } finally {
        setIsLoggingIn(false)
      }
    },
    [context],
  )

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return {
    ...context,
    login,
    isLoggingIn,
    error,
    setError,
  }
}

export default useAuth
