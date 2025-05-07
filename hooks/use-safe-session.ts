"use client"

import { useEffect, useState } from "react"

export function useSafeSession() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getSession() {
      try {
        const res = await fetch("/api/auth/session")
        const data = await res.json()
        setSession(data.user)
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setLoading(false)
      }
    }

    getSession()
  }, [])

  return { session, loading }
}
