"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  return (
    <Button
      variant="outline"
      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}
