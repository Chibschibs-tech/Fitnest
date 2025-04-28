"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export function useSafeSession() {
  // Start with a loading state
  const [isMounted, setIsMounted] = useState(false)
  const session = useSession()

  // Only enable the hook after mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Return a placeholder during SSR
  if (!isMounted) {
    return { data: null, status: "loading" }
  }

  // Use the actual hook only on the client
  return session
}
