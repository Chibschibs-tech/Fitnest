"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export function useSafeSession() {
  const session = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return a placeholder during SSR
  if (!mounted) {
    return {
      data: null,
      status: "loading",
      update: async () => null,
    }
  }

  return session
}
