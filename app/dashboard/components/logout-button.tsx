"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/logout") // Fallback to our custom logout page
    }
  }

  return (
    <Button
      variant="outline"
      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}
