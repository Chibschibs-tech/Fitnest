import { NextResponse } from "next/server"
import { getAllWaitlistSubmissions, checkWaitlistTable, createWaitlistTable } from "@/lib/waitlist-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET() {
  try {
    // Check for admin authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
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
