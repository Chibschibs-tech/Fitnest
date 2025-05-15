import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdminDashboardContent } from "./admin-dashboard-content"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== "admin") {
    redirect("/login?redirect=/admin")
  }

  return <AdminDashboardContent />
}
