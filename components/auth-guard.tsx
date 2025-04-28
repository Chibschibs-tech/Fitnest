"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { status, isAuthenticated } = useAuth()

  useEffect(() => {
    if (status !== "loading" && !isAuthenticated) {
      router.push("/login")
    }
  }, [status, isAuthenticated, router])

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
