import { NextResponse } from "next/server"
import { getAllWaitlistSubmissions, checkWaitlistTable, createWaitlistTable } from "@/lib/waitlist-db"
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

    // Ensure the waitlist table exists
    const tableExists = await checkWaitlistTable()

    if (!tableExists) {
      await createWaitlistTable()
    }

    // Get all waitlist submissions
    const result = await getAllWaitlistSubmissions()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in waitlist API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
