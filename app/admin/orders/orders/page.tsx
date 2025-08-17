import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import OrdersContent from "./orders-content"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session-id")?.value

  if (!sessionId) {
    redirect("/login?redirect=/admin/orders/orders")
  }

  const user = await getSessionUser(sessionId)

  if (!user || user.role !== "admin") {
    redirect("/login?redirect=/admin/orders/orders")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-gray-600">View and manage one-time orders and express shop purchases</p>
      </div>
      <OrdersContent />
    </div>
  )
}
