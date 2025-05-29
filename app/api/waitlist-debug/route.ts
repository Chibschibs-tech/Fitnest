import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get the email from the query string
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    // Check if the email exists in the waitlist
    const existingUser = await sql`
      SELECT id, email, first_name, last_name, position, created_at 
      FROM waitlist 
      WHERE email = ${email}
    `

    return NextResponse.json({
      exists: existingUser.length > 0,
      user: existingUser.length > 0 ? existingUser[0] : null,
      tableExists: true,
    })
  } catch (error) {
    console.error("Waitlist debug error:", error)

    // Check if the error is because the table doesn't exist
    const errorMessage = String(error)
    const tableDoesNotExist =
      errorMessage.includes("does not exist") || errorMessage.includes("relation") || errorMessage.includes("table")

    if (tableDoesNotExist) {
      return NextResponse.json(
        {
          error: "Waitlist table does not exist",
          tableExists: false,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({ error: "Failed to check waitlist" }, { status: 500 })
  }
}
