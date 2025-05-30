import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/simple-auth"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({
        authenticated: false,
        error: "No session-id cookie found",
        cookies: Object.fromEntries(cookieStore.getAll().map((cookie) => [cookie.name, cookie.value])),
      })
    }

    // Use the existing session system
    const user = await getSessionUser(request)

    return NextResponse.json({
      authenticated: !!user,
      user: user || null,
      sessionId: sessionId.substring(0, 20) + "...", // Show partial session ID for debugging
      cookies: Object.fromEntries(cookieStore.getAll().map((cookie) => [cookie.name, cookie.value])),
    })
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      error: error.message,
      sessionId: cookieStore.get("session-id")?.value?.substring(0, 20) + "..." || "none",
    })
  }
}
