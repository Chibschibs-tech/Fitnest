import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ user: null, authenticated: false })
    }

    const user = await getSessionUser(sessionId)

    if (!user) {
      return NextResponse.json({ user: null, authenticated: false })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      authenticated: true,
    })
  } catch (error) {
    console.error("Error checking auth status:", error)
    return NextResponse.json({ user: null, authenticated: false })
  }
}
