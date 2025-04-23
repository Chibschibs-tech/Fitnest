import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import ActiveSubscription from "./components/active-subscription"
import UpcomingDeliveries from "./components/upcoming-deliveries"
import OrderHistory from "./components/order-history"
import AccountSettings from "./components/account-settings"
import MealPreferences from "./components/meal-preferences"
import DeliverySchedule from "./components/delivery-schedule"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LogoutButton from "./components/logout-button"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {session.user.name}!</h1>
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
