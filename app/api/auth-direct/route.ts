import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { decrypt } from "@/lib/jwt"

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
    const hasJWT = cookieStore.has("session")

    // Try to get the session token from either auth method
    const nextAuthToken = cookieStore.get("next-auth.session-token")?.value
    const jwtToken = cookieStore.get("session")?.value

    // Initialize user as null
    let user = null

    // Try NextAuth first if the token exists
    if (nextAuthToken) {
      const sql = neon(process.env.DATABASE_URL!)

      // Check if the sessions table exists
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `

      const hasSessionsTable = tables.some((t) => t.table_name === "sessions")

      if (hasSessionsTable) {
        // Try to get the user from the sessions table
        const sessions = await sql`
          SELECT * FROM sessions WHERE session_token = ${nextAuthToken} LIMIT 1
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

    // If NextAuth didn't work, try custom JWT
    if (!user && jwtToken) {
      try {
        // Decrypt the JWT token
        const payload = await decrypt(jwtToken)

        if (payload && payload.id) {
          // Verify the user exists in the database
          const sql = neon(process.env.DATABASE_URL!)
          const users = await sql`
            SELECT * FROM users WHERE id = ${payload.id} LIMIT 1
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
      } catch (jwtError) {
        console.error("JWT decryption error:", jwtError)
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
        sessionToken: nextAuthToken ? "[REDACTED]" : null,
        jwtToken: jwtToken ? "[REDACTED]" : null,
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
