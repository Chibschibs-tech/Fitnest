"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSafeSession } from "@/hooks/use-safe-session"
import NavbarAuth from "./navbar-auth"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSafeSession()
  const isAuthenticated = status === "authenticated"

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Fitnest.ma
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-green-600">
              Home
            </Link>
            <Link href="/meal-plans" className="text-gray-600 hover:text-green-600">
              Meal Plans
            </Link>
            <Link href="/meals" className="text-gray-600 hover:text-green-600">
              Meals
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-green-600">
              How It Works
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/order" className="hidden md:block">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Order Now
              </Button>
            </Link>
            <NavbarAuth />
          </div>
        </div>
      </div>
    </header>
  )
}

// Also export as named export for compatibility
export { Navbar }
