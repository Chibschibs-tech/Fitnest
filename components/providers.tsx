"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode
  session?: Session | null
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't use SessionProvider during SSR
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <SessionProvider
      session={session}
      refetchInterval={0} // Disable automatic refetching
      refetchOnWindowFocus={false} // Disable refetch on window focus
    >
      {children}
    </SessionProvider>
  )
}
