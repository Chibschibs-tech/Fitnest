import { NextResponse } from "next/server"
import { getAllWaitlistSubmissions } from "@/lib/waitlist-db"
import { verifyToken } from "@/lib/jwt"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Check for admin authentication using the existing JWT system
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("session-token")?.value

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "No session token" }, { status: 401 })
    }

    // Verify the JWT token
    const decoded = verifyToken(sessionToken)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 })
    }

    // Get all waitlist submissions
    const result = await getAllWaitlistSubmissions()

    if (!result.success || !result.data) {
      return NextResponse.json({ success: false, error: result.error || "Failed to fetch data" }, { status: 500 })
    }

    // Convert to CSV
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Meal Plan",
      "City",
      "Notifications",
      "Created At",
    ]
    const entries = result.data

    const csvRows = [
      headers.join(","),
      ...entries.map((entry: any) =>
        [
          entry.id,
          `"${entry.first_name || ""}"`,
          `"${entry.last_name || ""}"`,
          `"${entry.email || ""}"`,
          `"${entry.phone || ""}"`,
          `"${entry.meal_plan || ""}"`,
          `"${entry.city || ""}"`,
          entry.notifications ? "Yes" : "No",
          entry.created_at,
        ].join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="waitlist-entries-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error in waitlist export API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
