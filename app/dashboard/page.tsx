import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import ActiveSubscription from "./components/active-subscription"
import UpcomingDeliveries from "./components/upcoming-deliveries"
import OrderHistory from "./components/order-history"
import AccountSettings from "./components/account-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome, {session.user.name}!</h1>
        <p className="text-gray-600">Manage your meal plans, deliveries, and account settings</p>
      </div>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="subscription">My Subscription</TabsTrigger>
          <TabsTrigger value="deliveries">Upcoming Deliveries</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription">
          <ActiveSubscription />
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
