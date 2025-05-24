import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    const healthCheck = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      auth: {
        sessionBased: true,
        hasSession: !!sessionId,
      },
      database: {
        connected: true, // We'll assume this for now
      },
    }

    if (sessionId) {
      const user = await getSessionUser(sessionId)
      healthCheck.auth = {
        ...healthCheck.auth,
        userAuthenticated: !!user,
        userId: user?.id || null,
      }
    }

    return NextResponse.json(healthCheck)
  } catch (error) {
    console.error("Auth health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
