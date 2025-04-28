"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useSafeSession } from "@/hooks/use-safe-session"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSafeSession()
  const isAuthenticated = status === "authenticated"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">Fitnest</span>
              <span className="text-2xl font-bold">.ma</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/order" className="text-sm font-medium hover:text-green-600 transition-colors">
              Order
            </Link>
            <Link href="/meal-plans" className="text-sm font-medium hover:text-green-600 transition-colors">
              Meal Plans
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:text-green-600 transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-green-600 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-green-600 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-medium text-white">
                0
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Sign In
                </Button>
              </Link>
            )}

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50 bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-green-600">Fitnest</span>
                <span className="text-2xl font-bold">.ma</span>
              </Link>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-8 px-4 space-y-6">
              <Link
                href="/order"
                className="block text-lg font-medium hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Order
              </Link>
              <Link
                href="/meal-plans"
                className="block text-lg font-medium hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Meal Plans
              </Link>
              <Link
                href="/how-it-works"
                className="block text-lg font-medium hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="block text-lg font-medium hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-lg font-medium hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-6 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="block">
                      <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setIsMenuOpen(false)
                        signOut({ callbackUrl: "/" })
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link href="/login" className="block">
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
