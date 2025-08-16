"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  PauseCircle,
  PlayCircle,
  Users,
  BarChart3,
  Mail,
  Settings,
  Plus,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Deliveries",
    href: "/admin/delivery-management",
    icon: Truck,
  },
  {
    title: "Paused Subscriptions",
    href: "/admin/subscriptions/paused",
    icon: PauseCircle,
  },
  {
    title: "Active Subscriptions",
    href: "/admin/subscriptions/active",
    icon: PlayCircle,
  },
  {
    title: "Waitlist",
    href: "/admin/waitlist",
    icon: Users,
  },
  {
    title: "Nutrition Manager",
    href: "/admin/nutrition-manager",
    icon: BarChart3,
  },
  {
    title: "Add Meals",
    href: "/admin/meals/add",
    icon: Plus,
  },
  {
    title: "Email Diagnostic",
    href: "/admin/email-diagnostic",
    icon: Mail,
  },
  {
    title: "System Diagnostic",
    href: "/admin/system-diagnostic",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
      </div>
      <nav className="px-3">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
