import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import WaitlistDataTable from "./waitlist-data-table"

export default async function WaitlistAdminPage() {
  // Check for admin authentication using the existing JWT system
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("session-token")?.value

  if (!sessionToken) {
    redirect("/login?callbackUrl=/admin/waitlist")
  }

  try {
    // Verify the JWT token
    const decoded = verifyToken(sessionToken)
    if (!decoded || decoded.role !== "admin") {
      redirect("/login?callbackUrl=/admin/waitlist")
    }
  } catch (error) {
    redirect("/login?callbackUrl=/admin/waitlist")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Waitlist Submissions</h1>
      <WaitlistDataTable />
    </div>
  )
}
