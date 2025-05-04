"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSafeSession } from "@/hooks/use-safe-session"
import { LogOut, User } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface NavbarAuthProps {
  isMobile?: boolean
  onMenuClose?: () => void
}

export default function NavbarAuth({ isMobile = false, onMenuClose }: NavbarAuthProps) {
  const { data: session, status } = useSafeSession()
  const router = useRouter()

  const handleLogout = async () => {
    if (onMenuClose) {
      onMenuClose()
    }

    try {
      await signOut({ redirect: false })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/logout")
    }
  }

  if (status === "loading") {
    return null
  }

  if (status === "authenticated") {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center text-gray-600 hover:text-logo-green px-2 py-1 rounded hover:bg-gray-100"
            onClick={onMenuClose}
          >
            <User className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left text-gray-600 hover:text-logo-green px-2 py-1 rounded hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-logo-green hover:bg-gray-100">
            Dashboard
          </Button>
        </Link>
        <Button variant="ghost" onClick={handleLogout} className="text-logo-green hover:bg-gray-100">
          Logout
        </Button>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="space-y-2">
        <Link
          href="/login"
          className="block text-gray-600 hover:text-logo-green px-2 py-1 rounded hover:bg-gray-100"
          onClick={onMenuClose}
        >
          Login
        </Link>
        <Link
          href="/register"
          className="block text-logo-green font-medium px-2 py-1 rounded hover:bg-gray-100"
          onClick={onMenuClose}
        >
          Sign Up
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/login">
        <Button variant="ghost" className="text-logo-green hover:bg-gray-100">
          Login
        </Button>
      </Link>
      <Link href="/register">
        <Button className="bg-logo-green hover:bg-logo-green/90 text-white">Sign Up</Button>
      </Link>
    </div>
  )
}
