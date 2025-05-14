import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Get all cookies for debugging
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    const cookieNames = allCookies.map((cookie) => cookie.name)

    // Check for specific auth cookies
    const hasNextAuthSession = cookieStore.has("next-auth.session-token")
    const hasNextAuthCallbackUrl = cookieStore.has("next-auth.callback-url")
    const hasNextAuthCsrfToken = cookieStore.has("next-auth.csrf-token")
    const hasJWT = cookieStore.has("jwt")

    // Try to get the session token
    const sessionToken = cookieStore.get("next-auth.session-token")?.value

    // If we have a session token, try to get the user from the database
    let user = null
    if (sessionToken) {
      const sql = neon(process.env.DATABASE_URL!)

      // First check if the sessions table exists
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `

      const hasSessionsTable = tables.some((t) => t.table_name === "sessions")

      if (hasSessionsTable) {
        // Try to get the user from the sessions table
        const sessions = await sql`
          SELECT * FROM sessions WHERE session_token = ${sessionToken} LIMIT 1
        `

        if (sessions.length > 0) {
          const session = sessions[0]
          // Get the user from the users table
          const users = await sql`
            SELECT * FROM users WHERE id = ${session.user_id} LIMIT 1
          `

          if (users.length > 0) {
            user = {
              id: users[0].id,
              name: users[0].name,
              email: users[0].email,
              role: users[0].role,
            }
          }
        }
      }
    }

    return NextResponse.json({
      status: "success",
      cookies: {
        names: cookieNames,
        hasNextAuthSession,
        hasNextAuthCallbackUrl,
        hasNextAuthCsrfToken,
        hasJWT,
        sessionToken: sessionToken ? "[REDACTED]" : null,
      },
      user,
      isAuthenticated: !!user,
    })
  } catch (error) {
    console.error("Auth direct error:", error)
    return NextResponse.json({
      status: "error",
      message: "Failed to check authentication directly",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
