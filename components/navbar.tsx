"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingBag } from "lucide-react"
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
    { href: "/meals", label: "Recettes" },
    { href: "/express-shop", label: "Express Shop" },
    { href: "/about", label: "A propos" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md transition-all duration-300 ${
        isScrolled ? "shadow-lg border-gray-200" : "border-gray-100"
      }`}
    >
      <div className="container mx-auto flex h-16 md:h-18 items-center px-4 md:px-6">
        {/* Logo - Left */}
        <div className="flex items-center flex-shrink-0">
          <Link 
            href="/home" 
            className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg transition-all duration-300 hover:scale-105"
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
        <nav className="hidden lg:flex lg:items-center lg:space-x-2 flex-1 justify-center" aria-label="Main navigation">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`group relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2
                ${
                isActive(route.href) 
                  ? "text-fitnest-green bg-fitnest-green/5" 
                  : "text-gray-700 hover:text-fitnest-green hover:bg-gray-50"
              }`}
            >
              {route.label}
              {isActive(route.href) && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-fitnest-green to-fitnest-orange rounded-full" />
              )}
              {!isActive(route.href) && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-fitnest-green to-fitnest-orange rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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
              className="bg-gradient-to-r from-fitnest-orange to-orange-500 hover:from-orange-500 hover:to-fitnest-orange text-white font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-xl group"
              size="default"
            >
              <ShoppingBag className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span>Commander</span>
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-fitnest-green rounded-xl"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </Button>
            </SheetTrigger>
            
            {/* Mobile Menu Content */}
            <SheetContent 
              side="right" 
              className="w-[85%] sm:w-[400px] px-0 border-l-2"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="px-6 py-5 border-b bg-gradient-to-r from-fitnest-green/5 to-fitnest-orange/5">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">Menu</h2>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Mobile navigation">
                  <div className="flex flex-col space-y-2">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={`flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl transition-all duration-300
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 ${
                          isActive(route.href)
                            ? "bg-gradient-to-r from-fitnest-green/10 to-fitnest-orange/10 text-fitnest-green border-l-4 border-fitnest-green"
                            : "text-gray-700 hover:bg-gray-50 hover:text-fitnest-green hover:translate-x-1"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span>{route.label}</span>
                        {isActive(route.href) && (
                          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-fitnest-green to-fitnest-orange animate-pulse" />
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Order CTA */}
                  <div className="mt-8">
                    <Link
                      href="/order"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button 
                        className="w-full bg-gradient-to-r from-fitnest-orange to-orange-500 hover:from-orange-500 hover:to-fitnest-orange text-white font-bold shadow-lg py-6 text-base rounded-xl group"
                      >
                        <ShoppingBag className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                        <span>Commander</span>
                      </Button>
                    </Link>
                  </div>
                </nav>
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
