"use client"

import { createContext, useState, useEffect, ReactNode } from "react"

// User type
export interface User {
  id?: string | number
  name: string
  email: string
  avatar?: string
  role?: string
}

// Auth context type
interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
}

// Create context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
})

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user from localStorage first (for persistence)
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }

        // Optionally: verify with backend
        // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        // const response = await fetch(`${apiUrl}/me`)
        // if (response.ok) {
        //   const data = await response.json()
        //   setUser(data.user)
        //   localStorage.setItem("user", JSON.stringify(data.user))
        // } else {
        //   localStorage.removeItem("user")
        //   setUser(null)
        // }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("user")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
