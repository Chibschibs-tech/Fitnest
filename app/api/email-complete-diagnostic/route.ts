import { NextResponse } from "next/server"
import { checkEmailConfig, sendWelcomeEmail } from "@/lib/email-utils"

export async function GET() {
  try {
    console.log("=== COMPLETE EMAIL DIAGNOSTIC ===")

    // Check all environment variables
    const envVars = {
      EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
      EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
      EMAIL_SERVER_SECURE: process.env.EMAIL_SERVER_SECURE,
      EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
      EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD ? "SET" : "NOT SET",
      EMAIL_FROM: process.env.EMAIL_FROM,
    }

    console.log("Environment variables:", envVars)

    // Check email configuration
    const configCheck = await checkEmailConfig()
    console.log("Email config check:", configCheck)

    // Test email sending to a safe test address
    let emailTest = null
    try {
      emailTest = await sendWelcomeEmail("test@example.com", "Test User")
      console.log("Email test result:", emailTest)
    } catch (emailError) {
      console.error("Email test failed:", emailError)
      emailTest = { success: false, error: emailError instanceof Error ? emailError.message : String(emailError) }
    }

    return NextResponse.json({
      success: true,
      environment: envVars,
      configCheck,
      emailTest,
      recommendations: {
        missingVars: Object.entries(envVars)
          .filter(([key, value]) => !value)
          .map(([key]) => key),
        nextSteps: [
          "Verify all email environment variables are set",
          "Check SMTP server credentials",
          "Ensure firewall allows SMTP connections",
          "Test with a different email provider if needed",
        ],
      },
    })
  } catch (error) {
    console.error("Diagnostic error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        details: error,
      },
      { status: 500 },
    )
  }
}
