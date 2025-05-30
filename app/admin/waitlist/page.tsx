import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import WaitlistDataTable from "./waitlist-data-table"

export default async function WaitlistAdminPage() {
  // Check for admin authentication
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/admin/waitlist")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Waitlist Submissions</h1>
      <WaitlistDataTable />
    </div>
  )
}
