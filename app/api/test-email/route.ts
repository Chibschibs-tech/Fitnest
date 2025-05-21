import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, subject, message } = body

    if (!email || !subject || !message) {
      return NextResponse.json({ success: false, error: "Email, subject, and message are required" }, { status: 400 })
    }

    // Use the provided email configuration
    const host = "smtp.gmail.com"
    const port = 587
    const secure = false
    const user = "noreply@fitnest.ma"
    const pass = "lfih nrfi ybfo asud"
    const from = "Fitnest.ma <noreply@fitnest.ma>"

    // Create transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    })

    // Verify connection
    await transporter.verify()

    // Send email
    const info = await transporter.sendMail({
      from,
      to: email,
      subject,
      text: message,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <h1 style="color: #4CAF50;">Fitnest.ma</h1>
        <p>${message}</p>
        <p style="margin-top: 30px;">Best regards,<br>The Fitnest.ma Team</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
          <p>© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.</p>
        </div>
      </div>`,
    })

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      response: info.response,
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
