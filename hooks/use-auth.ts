"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: string
}

type AuthState = {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })
  const router = useRouter()

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session")
        const data = await res.json()

        if (data.user) {
          setAuth({
            user: data.user,
            loading: false,
            error: null,
          })
        } else {
          setAuth({
            user: null,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        setAuth({
          user: null,
          loading: false,
          error: "Failed to fetch session",
        })
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    setAuth((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setAuth({
          user: data.user,
          loading: false,
          error: null,
        })
        router.push("/dashboard")
        return true
      } else {
        setAuth((prev) => ({
          ...prev,
          loading: false,
          error: data.message || "Login failed",
        }))
        return false
      }
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        loading: false,
        error: "An error occurred during login",
      }))
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setAuth({
        user: null,
        loading: false,
        error: null,
      })

      router.push("/")
      return true
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        error: "Logout failed",
      }))
      return false
    }
  }

  return {
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    login,
    logout,
    isAuthenticated: !!auth.user,
  }
}
