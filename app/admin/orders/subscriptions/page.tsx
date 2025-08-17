import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import SubscriptionsContent from "./subscriptions-content"

export const dynamic = "force-dynamic"

export default async function SubscriptionsPage() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session-id")?.value

  if (!sessionId) {
    redirect("/login?redirect=/admin/orders/subscriptions")
  }

  const user = await getSessionUser(sessionId)

  if (!user || user.role !== "admin") {
    redirect("/login?redirect=/admin/orders/subscriptions")
  }

  return (
    <div className="container mx-auto p-6">
      <SubscriptionsContent />
    </div>
  )
}
