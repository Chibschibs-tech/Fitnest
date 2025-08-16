"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Users,
  Mail,
  Settings,
  BarChart3,
  PauseCircle,
  PlayCircle,
  Package,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Deliveries", href: "/admin/delivery-management", icon: Truck },
  { name: "Paused Subscriptions", href: "/admin/subscriptions/paused", icon: PauseCircle },
  { name: "Active Subscriptions", href: "/admin/subscriptions/active", icon: PlayCircle },
  { name: "Waitlist", href: "/admin/waitlist", icon: Users },
  { name: "Nutrition Manager", href: "/admin/nutrition-manager", icon: BarChart3 },
  { name: "Add Meals", href: "/admin/meals/add", icon: Package },
  { name: "Email Diagnostic", href: "/admin/email-diagnostic", icon: Mail },
  { name: "System Diagnostic", href: "/admin/system-diagnostic", icon: Settings },
]

function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive ? "bg-green-100 text-green-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive ? "text-green-500" : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 flex-shrink-0 h-5 w-5",
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
