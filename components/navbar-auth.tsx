"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "./logout-button"

export default function NavbarAuth() {
  const { isAuthenticated, status } = useAuth()

  if (status === "loading") {
    return null
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <LogoutButton />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/login">
        <Button variant="ghost">Sign in</Button>
      </Link>
      <Link href="/register">
        <Button className="bg-green-600 hover:bg-green-700">Sign up</Button>
      </Link>
    </div>
  )
}
