import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/simple-auth"

export async function GET(request: Request) {
  try {
    // Get session from cookie header
    const cookieHeader = request.headers.get("cookie")
    const sessionId = cookieHeader
      ?.split(";")
      .find((c) => c.trim().startsWith("session-id="))
      ?.split("=")[1]

    if (!sessionId) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        message: "No session found",
      })
    }

    const user = await getSessionUser(sessionId)

    return NextResponse.json({
      authenticated: !!user,
      user: user,
      message: user ? "Session valid" : "Session invalid",
    })
  } catch (error) {
    console.error("Auth health check error:", error)
    return NextResponse.json({
      authenticated: false,
      user: null,
      error: "Auth health check failed",
    })
  }
}
