import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Check authentication
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "No session found" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // This is exactly what the current admin waitlist API is doing
    const submissions = await sql`
      SELECT * FROM waitlist 
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      query: "SELECT * FROM waitlist ORDER BY created_at DESC",
      submissions,
      count: submissions.length,
      sampleSubmission: submissions[0] || null,
      allColumns: submissions[0] ? Object.keys(submissions[0]) : [],
    })
  } catch (error) {
    console.error("Current waitlist debug error:", error)
    return NextResponse.json({ error: "Debug failed", details: error.message }, { status: 500 })
  }
}
