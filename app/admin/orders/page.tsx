import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdminOrdersContent } from "./admin-orders-content"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== "admin") {
    redirect("/login?redirect=/admin/orders")
  }

  return <AdminOrdersContent />
}
