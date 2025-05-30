import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/simple-auth"
import WaitlistDataTable from "./waitlist-data-table"

export default async function WaitlistAdminPage() {
  // Get session ID from cookies
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session-id")?.value

  if (!sessionId) {
    redirect("/login?callbackUrl=/admin/waitlist")
  }

  // Use the existing session authentication system
  const user = await getSessionUser(sessionId)

  if (!user) {
    redirect("/login?callbackUrl=/admin/waitlist")
  }

  if (user.role !== "admin") {
    // Redirect non-admin users
    redirect("/")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Waitlist Submissions</h1>
      <p className="mb-4">View and export all waitlist submissions.</p>
      <WaitlistDataTable />
    </div>
  )
}
