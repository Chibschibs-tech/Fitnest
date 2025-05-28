import { NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/email-utils"

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    // Only allow testing to safe domains or specific test emails
    const safeDomains = ["example.com", "test.com", "gmail.com", "outlook.com", "hotmail.com"]
    const emailDomain = email.split("@")[1]

    if (!safeDomains.includes(emailDomain) && !email.startsWith("test")) {
      return NextResponse.json({ error: "For safety, only test emails or common domains are allowed" }, { status: 400 })
    }

    console.log(`Testing welcome email to: ${email}`)

    const result = await sendWelcomeEmail(email, name)

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      message: result.success ? "Welcome email sent successfully" : "Failed to send welcome email",
    })
  } catch (error) {
    console.error("Test welcome email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
