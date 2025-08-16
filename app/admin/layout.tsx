import type React from "react"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { AdminSidebar } from "./admin-sidebar"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session-id")?.value

  if (!sessionId) {
    redirect("/login?redirect=/admin")
  }

  const user = await getSessionUser(sessionId)

  if (!user || user.role !== "admin") {
    redirect("/login?redirect=/admin")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64">{children}</main>
    </div>
  )
}
