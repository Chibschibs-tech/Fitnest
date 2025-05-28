import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // Check if user exists
    const users = await sql`SELECT id, name, email, role FROM users WHERE email = ${email}`

    if (users.length === 0) {
      return NextResponse.json({
        exists: false,
        message: "User not found. You may need to register first.",
      })
    }

    return NextResponse.json({
      exists: true,
      user: {
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
        role: users[0].role,
      },
    })
  } catch (error) {
    console.error("Check user error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
