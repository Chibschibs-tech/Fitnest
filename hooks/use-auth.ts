"use client"

import { useContext, useState, useCallback } from "react"
import { AuthContext } from "@/components/auth-provider"

export function useAuth() {
  const context = useContext(AuthContext)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoggingIn(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      // Refresh the auth context
      window.location.href = "/dashboard"
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoggingIn(false)
    }
  }, [])

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return {
    ...context,
    login,
    isLoggingIn,
  }
}

export default useAuth
