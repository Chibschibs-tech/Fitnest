"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden text-logo-green"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink href="/" onOpenChange={setOpen} className="flex items-center">
          <Image
            src="https://obtmksfewry4ishp.public.blob.vercel-storage.com/Logo/Logo-Fitnest-Vert-v412yUnhxctld0VkvDHD8wXh8H2GMQ.png"
            alt="Fitnest.ma Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </MobileLink>
        <div className="flex flex-col space-y-3 pt-4">
          <MobileLink href="/meal-plans" onOpenChange={setOpen}>
            Meal Plans
          </MobileLink>
          <MobileLink href="/meals" onOpenChange={setOpen}>
            Meals
          </MobileLink>
          <MobileLink href="/how-it-works" onOpenChange={setOpen}>
            How It Works
          </MobileLink>
          {isAuthenticated ? (
            <>
              <MobileLink href="/dashboard" onOpenChange={setOpen}>
                Dashboard
              </MobileLink>
              <MobileLink href="/order" onOpenChange={setOpen}>
                Orders
              </MobileLink>
              <Button
                variant="ghost"
                className="justify-start px-2 text-logo-green hover:bg-gray-100"
                onClick={() => {
                  setOpen(false)
                  // Add logout functionality here
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <MobileLink href="/login" onOpenChange={setOpen}>
                Login
              </MobileLink>
              <MobileLink href="/register" onOpenChange={setOpen} className="text-logo-green font-medium">
                Sign Up
              </MobileLink>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          className="absolute right-4 top-4 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          onClick={() => setOpen(false)}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps {
  href: string
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={`text-base hover:text-logo-green ${className}`}
      {...props}
    >
      {children}
    </Link>
  )
}
