import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, mealPlan, city, notifications } = body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "First name, last name, and email are required" }, { status: 400 })
    }

    // Create email content
    const emailContent = `
      New Waitlist Signup:
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone || "Not provided"}
      Preferred Meal Plan: ${mealPlan || "Not selected"}
      City: ${city || "Not selected"}
      Wants Notifications: ${notifications ? "Yes" : "No"}
      Date: ${new Date().toLocaleString()}
    `

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "noreply@fitnest.ma",
      subject: `New Waitlist Signup: ${firstName} ${lastName}`,
      text: emailContent,
    })

    // Return success
    return NextResponse.json({
      success: true,
      message: "Waitlist signup received",
    })
  } catch (error) {
    console.error("Waitlist email error:", error)

    // Still return success even if email fails
    return NextResponse.json({
      success: true,
      message: "Waitlist signup received",
    })
  }
}
