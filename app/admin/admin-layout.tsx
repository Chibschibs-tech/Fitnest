"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Settings,
  Menu,
  X,
  BarChart,
  ImageIcon,
  FileText,
  Calendar,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Meal Plans", href: "/admin/meal-plans", icon: FileText },
    { name: "Deliveries", href: "/admin/deliveries", icon: Calendar },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart },
    { name: "Images", href: "/admin/images", icon: ImageIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile navigation */}
      <div className="border-b bg-gray-900 lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/admin" className="text-xl font-bold text-white">
            Fitnest Admin
          </Link>
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-gray-900 p-0 text-white sm:w-[350px]">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-gray-800 px-4 py-6">
                  <Link href="/admin" className="text-xl font-bold text-white">
                    Fitnest Admin
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)} className="text-white">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex-1 space-y-1 px-2 py-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                        pathname === item.href
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      )}
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="border-t border-gray-800 px-4 py-4">
                  <Link href="/" passHref>
                    <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                      <LogOut className="mr-2 h-4 w-4" />
                      Back to Site
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden border-r border-gray-800 bg-gray-900 lg:block lg:w-64">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-gray-800 px-6">
              <Link href="/admin" className="text-xl font-bold text-white">
                Fitnest Admin
              </Link>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="border-t border-gray-800 px-4 py-4">
              <Link href="/" passHref>
                <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                  <LogOut className="mr-2 h-4 w-4" />
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-auto">
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

export { AdminLayout }
