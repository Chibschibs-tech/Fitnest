"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({ variant = "default", size = "default", className = "" }: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} className={className}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  )
}
