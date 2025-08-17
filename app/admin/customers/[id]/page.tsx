import { Suspense } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/simple-auth"
import CustomerDetailContent from "./customer-detail-content"

export const dynamic = "force-dynamic"

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session-id")?.value

  if (!sessionId) {
    redirect("/login?redirect=/admin/customers/" + params.id)
  }

  const user = await getSessionUser(sessionId)

  if (!user || user.role !== "admin") {
    redirect("/login?redirect=/admin/customers/" + params.id)
  }

  return (
    <Suspense fallback={<div>Loading customer details...</div>}>
      <CustomerDetailContent customerId={params.id} />
    </Suspense>
  )
}
