"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, Truck, PauseCircle, PlayCircle, Users, Apple, Mail, Settings } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: Package,
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
    icon: Apple,
  },
  {
    title: "Add Meals",
    href: "/admin/meals/add",
    icon: Apple,
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
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
      </div>

      <nav className="px-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
