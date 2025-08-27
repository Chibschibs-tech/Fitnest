"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Package, ShoppingCart, Truck, BarChart3, Database, Calendar, FileText } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
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
    icon: Calendar,
    children: [
      { name: "Manage Plans", href: "/admin/subscription-plans" },
      { name: "Create Plan", href: "/admin/subscription-plans/create" },
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
    icon: FileText,
  },
  {
    name: "System",
    icon: Database,
    children: [
      { name: "Check Tables", href: "/admin/check-subscription-tables" },
      { name: "Create Tables", href: "/admin/create-subscription-tables" },
      { name: "Initialize Plans", href: "/admin/init-subscription-plans" },
      { name: "Debug Database", href: "/admin/debug-database" },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
      </div>
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          if (item.children) {
            return (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center px-2 py-2 text-sm font-medium text-gray-600">
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </div>
                <div className="ml-6 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block px-2 py-1 text-sm rounded-md",
                        pathname === child.href
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                pathname === item.href
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
