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

          {/* Mobile Order Now button */}
          <Link href="/order" className="md:hidden">
            <Button size="sm" className="bg-fitnest-orange hover:bg-fitnest-orange/90 text-white">
              Order Now
            </Button>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-fitnest-green hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-fitnest-green">
              Home
            </Link>
            <Link href="/meal-plans" className="text-gray-600 hover:text-fitnest-green">
              Meal Plans
            </Link>
            <Link href="/meals" className="text-gray-600 hover:text-fitnest-green">
              Meals
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-fitnest-green">
              How It Works
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-fitnest-green">
              Blog
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/order" className="hidden md:block">
              <Button className="bg-fitnest-orange hover:bg-fitnest-orange/90 text-white">Order Now</Button>
            </Link>
            <NavbarAuth />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed top-[73px] left-0 right-0 bg-white z-50 border-b border-gray-200 shadow-lg">
            <nav className="flex flex-col space-y-4 p-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-fitnest-green px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/meal-plans"
                className="text-gray-600 hover:text-fitnest-green px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Meal Plans
              </Link>
              <Link
                href="/meals"
                className="text-gray-600 hover:text-fitnest-green px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Meals
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-600 hover:text-fitnest-green px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/blog"
                className="text-gray-600 hover:text-fitnest-green px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
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
