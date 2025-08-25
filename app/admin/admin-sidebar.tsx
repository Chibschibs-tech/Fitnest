"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Truck,
  BarChart3,
  Mail,
  Database,
  RefreshCw,
  Utensils,
  Coffee,
  Dumbbell,
  Gift,
  CreditCard,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Products",
    icon: Package,
    children: [
      { title: "Meals", href: "/admin/products/meals", icon: Utensils },
      { title: "Meal Plans", href: "/admin/products/meal-plans", icon: Dumbbell },
      { title: "Snacks", href: "/admin/products/snacks", icon: Coffee },
      { title: "Express Shop", href: "/admin/products/express-shop", icon: ShoppingCart },
      { title: "Accessories", href: "/admin/products/accessories", icon: Gift },
    ],
  },
  {
    title: "Subscriptions",
    icon: RefreshCw,
    children: [
      { title: "Subscription Plans", href: "/admin/subscription-plans", icon: CreditCard },
      { title: "Active", href: "/admin/subscriptions/active", icon: RefreshCw },
      { title: "Paused", href: "/admin/subscriptions/paused", icon: RefreshCw },
    ],
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    children: [
      { title: "All Orders", href: "/admin/orders/orders", icon: ShoppingCart },
      { title: "Subscriptions", href: "/admin/orders/subscriptions", icon: RefreshCw },
    ],
  },
  {
    title: "Deliveries",
    href: "/admin/deliveries",
    icon: Truck,
  },
  {
    title: "Waitlist",
    href: "/admin/waitlist",
    icon: Mail,
  },
  {
    title: "System",
    icon: Database,
    children: [
      { title: "Create Subscription Tables", href: "/admin/create-subscription-tables", icon: Database },
      { title: "Initialize Plans", href: "/admin/init-subscription-plans", icon: RefreshCw },
      { title: "System Diagnostic", href: "/admin/system-diagnostic", icon: BarChart3 },
      { title: "Debug Database", href: "/admin/debug-database", icon: Database },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <div>
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </div>
                  <ul className="ml-6 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                            pathname === child.href
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                          )}
                        >
                          <child.icon className="mr-3 h-4 w-4" />
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
