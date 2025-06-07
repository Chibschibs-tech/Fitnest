import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST() {
  try {
    console.log("Starting direct email test to chihab.jabri@gmail.com")

    // Get environment variables
    const host = process.env.EMAIL_SERVER_HOST
    const port = Number(process.env.EMAIL_SERVER_PORT)
    const secure = process.env.EMAIL_SERVER_SECURE === "true"
    const user = process.env.EMAIL_SERVER_USER
    const pass = process.env.EMAIL_SERVER_PASSWORD
    const from = process.env.EMAIL_FROM

    console.log("Email config:", {
      host,
      port,
      secure,
      user,
      from,
      passwordLength: pass?.length || 0,
    })

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      debug: true,
    })

    // Verify transporter
    console.log("Verifying transporter...")
    await transporter.verify()
    console.log("Transporter verified successfully")

    // Send test email
    const mailOptions = {
      from: from,
      to: "chihab.jabri@gmail.com",
      subject: "Direct Email Test - Fitnest.ma",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #015033; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Email Test</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <p>Hello Chihab,</p>
            <p>This is a direct email test from Fitnest.ma to verify the email configuration is working.</p>
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Sent at: ${new Date().toISOString()}</li>
              <li>From: ${from}</li>
              <li>To: chihab.jabri@gmail.com</li>
            </ul>
            <p>If you receive this email, the configuration is working correctly.</p>
          </div>
        </div>
      `,
      text: `Email Test - Fitnest.ma

Hello Chihab,

This is a direct email test from Fitnest.ma to verify the email configuration is working.

Test Details:
- Sent at: ${new Date().toISOString()}
- From: ${from}
- To: chihab.jabri@gmail.com

If you receive this email, the configuration is working correctly.
`,
    }

    console.log("Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })

    const info = await transporter.sendMail(mailOptions)

    console.log("Email sent successfully:", {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
    })

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
    })
  } catch (error) {
    console.error("Direct email test failed:", error)
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
