import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession, initSessionTable } from "@/lib/simple-auth"

export async function POST(request: NextRequest) {
  try {
    // Ensure session table exists
    await initSessionTable()

    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 })
    }

    const user = await createUser(name, email, password)

    if (!user) {
      return NextResponse.json({ error: "User already exists or creation failed" }, { status: 409 })
    }

    const sessionId = await createSession(user.id)

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("session-id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
