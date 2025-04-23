"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"

export function NavbarAuth() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <LogoutButton variant="ghost" />
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-green-600 hover:bg-green-700">Sign up</Button>
          </Link>
        </>
      )}
    </div>
  )
}
