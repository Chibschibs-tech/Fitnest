"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingBag } from "lucide-react"
import { CartIcon } from "@/components/cart-icon"
import { NavbarAuth } from "@/components/navbar-auth"
import Image from "next/image"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Track scroll position for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const routes = [
    { href: "/meal-plans", label: "Meal Plans" },
    { href: "/meals", label: "Meals" },
    { href: "/express-shop", label: "Express Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        {/* Logo - Left */}
        <div className="flex items-center flex-shrink-0">
          <Link 
            href="/home" 
            className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md transition-transform hover:scale-105"
            aria-label="Fitnest.ma Home"
          >
            <Image
              src="https://obtmksfewry4ishp.public.blob.vercel-storage.com/Logo/Logo-Fitnest-Vert-v412yUnhxctld0VkvDHD8wXh8H2GMQ.png"
              alt="Fitnest.ma"
              width={140}
              height={48}
              className="h-10 w-auto md:h-12"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation - Center */}
        <nav className="hidden lg:flex lg:items-center lg:space-x-1 flex-1 justify-center" aria-label="Main navigation">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2
                hover:bg-gray-50 ${
                isActive(route.href) 
                  ? "text-fitnest-green" 
                  : "text-gray-700 hover:text-fitnest-green"
              }`}
            >
              {route.label}
              {isActive(route.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-fitnest-green rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Order CTA - Desktop */}
          <Link
            href="/order"
            className="hidden lg:block"
          >
            <Button 
              className="bg-fitnest-orange hover:bg-fitnest-orange/90 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              size="default"
            >
              Order Now
            </Button>
          </Link>

          {/* Cart Icon */}
          <div className="hidden md:block">
            <CartIcon />
          </div>

          {/* Auth - Desktop */}
          {/* <div className="hidden lg:block">
            <NavbarAuth />
          </div>

          {/* Mobile Cart Icon */}
          <div className="md:hidden">
            <CartIcon />
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-fitnest-green"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            
            {/* Mobile Menu Content */}
            <SheetContent 
              side="right" 
              className="w-[85%] sm:w-[400px] px-0"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="px-6 py-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Mobile navigation">
                  <div className="flex flex-col space-y-1">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={`flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-all duration-200
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 ${
                          isActive(route.href)
                            ? "bg-fitnest-green/10 text-fitnest-green"
                            : "text-gray-700 hover:bg-gray-50 hover:text-fitnest-green"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span>{route.label}</span>
                        {isActive(route.href) && (
                          <div className="h-2 w-2 rounded-full bg-fitnest-green" />
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Order CTA */}
                  <div className="mt-6">
                    <Link
                      href="/order"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button 
                        className="w-full bg-fitnest-orange hover:bg-fitnest-orange/90 text-white font-semibold shadow-sm py-6 text-base"
                      >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </nav>

                {/* Auth Section - Mobile */}
                <div className="border-t px-6 py-4 bg-gray-50">
                  <NavbarAuth />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

// Also export as named export for compatibility
export { Navbar }
