"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Package, Settings, CreditCard, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import UpcomingDeliveries from "./components/upcoming-deliveries"
import ActiveSubscription from "./components/active-subscription"
import OrderHistory from "./components/order-history"
import AccountSettings from "./components/account-settings"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState("overview")

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <DashboardSkeleton />
  }

  if (!session?.user) {
    return <DashboardSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <div className="hidden md:block">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-green-100 text-green-700">
                  {session.user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{session.user.name}</p>
                <p className="text-sm text-gray-500">{session.user.email}</p>
              </div>
            </div>

            <div className="space-y-1">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "overview" ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <Package className="mr-2 h-4 w-4" />
                Overview
              </Button>
              <Button
                variant={activeTab === "subscription" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === "subscription" ? "bg-green-600 hover:bg-green-700" : ""
                }`}
                onClick={() => setActiveTab("subscription")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                My Subscription
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "orders" ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <Clock className="mr-2 h-4 w-4" />
                Order History
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "settings" ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </div>

            <div className="pt-6">
              <Button variant="outline" className="w-full justify-start" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <Package className="h-4 w-4" />
                <span className="sr-only">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="subscription">
                <Calendar className="h-4 w-4" />
                <span className="sr-only">Subscription</span>
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Clock className="h-4 w-4" />
                <span className="sr-only">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome back, {session.user.name?.split(" ")[0] || "User"}
                </h2>
                <div className="mt-2 flex space-x-2 md:mt-0">
                  <Link href="/meal-customization">
                    <Button className="bg-green-600 hover:bg-green-700">Customize Meal Plan</Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next Delivery</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Tomorrow</div>
                    <p className="text-xs text-muted-foreground">8:00 AM - 12:00 PM</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Weight Loss</div>
                    <p className="text-xs text-muted-foreground">5 days per week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Billing</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">349 MAD</div>
                    <p className="text-xs text-muted-foreground">Next billing on May 1, 2023</p>
                  </CardContent>
                </Card>
              </div>

              <UpcomingDeliveries />

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Stay updated with your meal plan and deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Your next delivery is scheduled for tomorrow",
                        description: "8:00 AM - 12:00 PM",
                        time: "2 hours ago",
                        type: "delivery",
                      },
                      {
                        title: "New menu for next week is available",
                        description: "Check out the new meals and customize your plan",
                        time: "1 day ago",
                        type: "menu",
                      },
                      {
                        title: "Your payment was successful",
                        description: "349 MAD for Weight Loss Plan (5 days)",
                        time: "3 days ago",
                        type: "payment",
                      },
                    ].map((notification, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div
                          className={`rounded-full p-2 ${
                            notification.type === "delivery"
                              ? "bg-blue-100"
                              : notification.type === "menu"
                                ? "bg-green-100"
                                : "bg-purple-100"
                          }`}
                        >
                          {notification.type === "delivery" ? (
                            <Package
                              className={`h-4 w-4 ${
                                notification.type === "delivery"
                                  ? "text-blue-600"
                                  : notification.type === "menu"
                                    ? "text-green-600"
                                    : "text-purple-600"
                              }`}
                            />
                          ) : notification.type === "menu" ? (
                            <Calendar
                              className={`h-4 w-4 ${
                                notification.type === "delivery"
                                  ? "text-blue-600"
                                  : notification.type === "menu"
                                    ? "text-green-600"
                                    : "text-purple-600"
                              }`}
                            />
                          ) : (
                            <CreditCard
                              className={`h-4 w-4 ${
                                notification.type === "delivery"
                                  ? "text-blue-600"
                                  : notification.type === "menu"
                                    ? "text-green-600"
                                    : "text-purple-600"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{notification.title}</p>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "subscription" && <ActiveSubscription />}
          {activeTab === "orders" && <OrderHistory />}
          {activeTab === "settings" && <AccountSettings />}
        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <div className="hidden md:block">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1 h-3 w-24" />
              </div>
            </div>
            <div className="space-y-1">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-10 w-40 md:mt-0" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}
