"use client"

import { type ReactNode, createContext, useState, useEffect } from "react"
import { SessionProvider, useSession } from "next-auth/react"

interface AuthContextType {
  user: any | null
  loading: boolean
  error: string | null
  setUser?: (user: any) => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
})

function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") {
      setLoading(true)
      return
    }

    if (status === "authenticated" && session?.user) {
      setUser(session.user)
      setLoading(false)
      setError(null)
      return
    }

    if (status === "unauthenticated") {
      setUser(null)
      setLoading(false)
      return
    }
  }, [session, status])

  return <AuthContext.Provider value={{ user, loading, error, setUser }}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  )
}

export default AuthProvider
