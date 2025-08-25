"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Package, ShoppingCart, Truck, Database, Mail, Repeat } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Products",
    icon: Package,
    children: [
      { name: "Meals", href: "/admin/products/meals" },
      { name: "Meal Plans", href: "/admin/products/meal-plans" },
      { name: "Snacks", href: "/admin/products/snacks" },
      { name: "Express Shop", href: "/admin/products/express-shop" },
      { name: "Accessories", href: "/admin/products/accessories" },
    ],
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    children: [
      { name: "All Orders", href: "/admin/orders/orders" },
      { name: "Subscriptions", href: "/admin/orders/subscriptions" },
    ],
  },
  {
    name: "Subscription Plans",
    icon: Repeat,
    children: [
      { name: "Manage Plans", href: "/admin/subscription-plans" },
      { name: "Create Plan", href: "/admin/subscription-plans/create" },
      { name: "Initialize Plans", href: "/admin/init-subscription-plans" },
    ],
  },
  {
    name: "Deliveries",
    href: "/admin/deliveries",
    icon: Truck,
  },
  {
    name: "Waitlist",
    href: "/admin/waitlist",
    icon: Mail,
  },
  {
    name: "System",
    icon: Database,
    children: [
      { name: "Create Tables", href: "/admin/create-subscription-tables" },
      { name: "System Diagnostic", href: "/admin/system-diagnostic" },
      { name: "Debug Database", href: "/admin/debug-database" },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
      </div>
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            if (item.children) {
              return (
                <li key={item.name}>
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </div>
                  <ul className="ml-6 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-md transition-colors",
                            pathname === child.href
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          )}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            }

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
