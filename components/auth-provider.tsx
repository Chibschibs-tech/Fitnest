"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { siteConfig } from "@/lib/constants"

type User = {
  id: number
  name: string
  email: string
  role: string
} | null

type AuthContextType = {
  user: User
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserFromSession() {
      try {
        const res = await fetch(`${siteConfig.apiUrl}/api/auth/session`)
        const data = await res.json()

        if (data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error("Failed to load user session:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromSession()
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
