import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({
        status: "success",
        authenticated: false,
        session: null,
        timestamp: new Date().toISOString(),
      })
    }

    const user = await getSessionUser(sessionId)

    return NextResponse.json({
      status: "success",
      authenticated: !!user,
      session: user
        ? {
            user: {
              name: user.name,
              email: user.email,
              role: user.role,
            },
          }
        : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Auth status check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
