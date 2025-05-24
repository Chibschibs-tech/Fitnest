"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-simple-auth"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function LogoutButton({ variant = "outline" }: LogoutButtonProps) {
  const { logout } = useAuth()

  return (
    <Button variant={variant} onClick={() => logout()}>
      Logout
    </Button>
  )
}
