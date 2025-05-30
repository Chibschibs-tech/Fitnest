import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { cookies } from "next/headers"

export async function GET() {
  let sessionToken
  try {
    const cookieStore = cookies()
    sessionToken = cookieStore.get("session-token")?.value

    if (!sessionToken) {
      return NextResponse.json({
        authenticated: false,
        error: "No session token found",
        cookies: Object.fromEntries(cookieStore.getAll().map((cookie) => [cookie.name, cookie.value])),
      })
    }

    // Verify the JWT token
    const decoded = verifyToken(sessionToken)

    return NextResponse.json({
      authenticated: !!decoded,
      user: decoded,
      sessionToken: sessionToken.substring(0, 20) + "...", // Show partial token for debugging
      cookies: Object.fromEntries(cookieStore.getAll().map((cookie) => [cookie.name, cookie.value])),
    })
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      error: error.message,
      sessionToken: sessionToken?.substring(0, 20) + "..." || "none",
    })
  }
}
