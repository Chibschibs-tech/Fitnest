"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface NavbarAuthProps {
  isMobile?: boolean
  onMenuClose?: () => void
}

function NavbarAuth({ isMobile = false, onMenuClose }: NavbarAuthProps) {
  // Authentication disabled - always show login/signup buttons
  // TODO: Re-enable authentication when needed

  if (isMobile) {
    return (
      <div className="space-y-2">
        <Link
          href="/login"
          className="block text-gray-600 hover:text-fitnest-green px-2 py-1 rounded hover:bg-gray-100"
          onClick={onMenuClose}
        >
          Login
        </Link>
        <Link
          href="/register"
          className="block text-fitnest-green font-medium px-2 py-1 rounded hover:bg-gray-100"
          onClick={onMenuClose}
        >
          Sign Up
        </Link>
        <Link
          href="/blog"
          className="block text-gray-600 hover:text-fitnest-green px-2 py-1 rounded hover:bg-gray-100"
          onClick={onMenuClose}
        >
          Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/login">
        <Button variant="ghost" className="text-fitnest-green hover:bg-gray-100">
          Login
        </Button>
      </Link>
      <Link href="/register">
        <Button className="bg-fitnest-green hover:bg-fitnest-green/90 text-white">Sign Up</Button>
      </Link>
    </div>
  )
}

// Export as both default and named export for compatibility
export default NavbarAuth
export { NavbarAuth }
