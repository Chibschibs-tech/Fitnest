"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ActiveSubscription from "./components/active-subscription"
import DeliverySchedule from "./components/delivery-schedule"
import MealPreferences from "./components/meal-preferences"
import OrderHistory from "./components/order-history"
import UpcomingDeliveries from "./components/upcoming-deliveries"
import AccountSettings from "./components/account-settings"
import { LogoutButton } from "@/components/logout-button"

export function DashboardContent() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/auth/session")
        const data = await res.json()

        if (data.user) {
          setUser(data.user)
        } else {
          setError("Unable to load user data. Please try logging in again.")
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Something went wrong. Please refresh the page and try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return <div className="container mx-auto p-4">Loading dashboard...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Please log in to view your dashboard.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name || "User"}!</h1>
          <p className="text-gray-600">Manage your meal plans, deliveries, and account settings</p>
        </div>
        <LogoutButton />
      </div>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="subscription">My Subscription</TabsTrigger>
          <TabsTrigger value="meal-preferences">Meal Preferences</TabsTrigger>
          <TabsTrigger value="delivery-schedule">Delivery Schedule</TabsTrigger>
          <TabsTrigger value="deliveries">Upcoming Meals</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription">
          <ActiveSubscription />
        </TabsContent>

        <TabsContent value="meal-preferences">
          <MealPreferences />
        </TabsContent>

        <TabsContent value="delivery-schedule">
          <DeliverySchedule />
        </TabsContent>

        <TabsContent value="deliveries">
          <UpcomingDeliveries />
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
