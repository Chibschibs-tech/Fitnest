"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useSafeSession } from "@/hooks/use-safe-session"
import NavbarAuth from "./navbar-auth"
import { Menu } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSafeSession()
  const isAuthenticated = status === "authenticated"

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="https://obtmksfewry4ishp.public.blob.vercel-storage.com/Logo/Logo-Fitnest-Vert-v412yUnhxctld0VkvDHD8wXh8H2GMQ.png"
              alt="Fitnest.ma Logo"
              width={150}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-logo-green hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-logo-green">
              Home
            </Link>
            <Link href="/meal-plans" className="text-gray-600 hover:text-logo-green">
              Meal Plans
            </Link>
            <Link href="/meals" className="text-gray-600 hover:text-logo-green">
              Meals
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-logo-green">
              How It Works
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/order" className="hidden md:block">
              <Button variant="outline" className="border-logo-green text-logo-green hover:bg-gray-100">
                Order Now
              </Button>
            </Link>
            <NavbarAuth />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-logo-green px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/meal-plans"
                className="text-gray-600 hover:text-logo-green px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Meal Plans
              </Link>
              <Link
                href="/meals"
                className="text-gray-600 hover:text-logo-green px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Meals
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-600 hover:text-logo-green px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/order"
                className="text-logo-green font-medium px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Order Now
              </Link>
              <div className="pt-2 border-t border-gray-100">
                <NavbarAuth isMobile={true} onMenuClose={() => setIsMenuOpen(false)} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Also export as named export for compatibility
export { Navbar }
