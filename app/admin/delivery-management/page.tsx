import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { DeliveryManagementContent } from "./delivery-management-content"

export const dynamic = "force-dynamic"

export default async function DeliveryManagementPage() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session-id")?.value

  if (!sessionId) {
    redirect("/login?redirect=/admin/delivery-management")
  }

  const user = await getSessionUser(sessionId)

  if (!user || user.role !== "admin") {
    redirect("/login?redirect=/admin/delivery-management")
  }

  return <DeliveryManagementContent />
}
