"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Package, ShoppingCart, Truck, BarChart3, FileText, Database, RefreshCw } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    items: [
      { title: "All Orders", href: "/admin/orders/orders" },
      { title: "Subscriptions", href: "/admin/orders/subscriptions" },
    ],
  },
  {
    title: "Products",
    icon: Package,
    items: [
      { title: "Meals", href: "/admin/products/meals" },
      { title: "Meal Plans", href: "/admin/products/meal-plans" },
      { title: "Snacks", href: "/admin/products/snacks" },
      { title: "Express Shop", href: "/admin/products/express-shop" },
      { title: "Accessories", href: "/admin/products/accessories" },
    ],
  },
  {
    title: "Subscription System",
    icon: RefreshCw,
    items: [
      { title: "Subscription Plans", href: "/admin/subscription-plans" },
      { title: "Active Subscriptions", href: "/admin/subscriptions/active" },
      { title: "Paused Subscriptions", href: "/admin/subscriptions/paused" },
    ],
  },
  {
    title: "Database Setup",
    icon: Database,
    items: [
      { title: "Check Tables", href: "/admin/check-subscription-tables" },
      { title: "Create Tables", href: "/admin/create-subscription-tables" },
      { title: "Initialize Plans", href: "/admin/init-subscription-plans" },
    ],
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Deliveries",
    href: "/admin/deliveries",
    icon: Truck,
  },
  {
    title: "Waitlist",
    href: "/admin/waitlist",
    icon: FileText,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Link>
              ) : (
                <div>
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </div>
                  {item.items && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={cn(
                              "block px-3 py-2 text-sm rounded-md transition-colors",
                              pathname === subItem.href
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                            )}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
