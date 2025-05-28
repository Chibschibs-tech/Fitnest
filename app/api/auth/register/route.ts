import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession, initTables } from "@/lib/simple-auth"
import { sendWelcomeEmail } from "@/lib/email-utils"

export async function POST(request: NextRequest) {
  try {
    await initTables()

    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 })
    }

    const user = await createUser(name, email, password)

    if (!user) {
      return NextResponse.json({ error: "User already exists or creation failed" }, { status: 409 })
    }

    const sessionId = await createSession(user.id)

    if (!sessionId) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      emailSent: false, // We'll update this based on email result
    })

    response.cookies.set("session-id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Send welcome email (don't block registration if email fails)
    try {
      console.log(`Attempting to send welcome email to: ${email}`)
      const emailResult = await sendWelcomeEmail(email, name)

      if (emailResult.success) {
        console.log("Welcome email sent successfully:", emailResult.messageId)
        // Update response to indicate email was sent
        const responseData = await response.json()
        responseData.emailSent = true
        responseData.emailMessageId = emailResult.messageId
        return NextResponse.json(responseData)
      } else {
        console.log("Welcome email failed (non-blocking):", emailResult.error)
        // Registration still succeeds, but email wasn't sent
        const responseData = await response.json()
        responseData.emailSent = false
        responseData.emailError = emailResult.error
        return NextResponse.json(responseData)
      }
    } catch (emailError) {
      console.log("Welcome email exception (non-blocking):", emailError)
      // Registration still succeeds, but email wasn't sent
      const responseData = await response.json()
      responseData.emailSent = false
      responseData.emailError = emailError instanceof Error ? emailError.message : String(emailError)
      return NextResponse.json(responseData)
    }
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
