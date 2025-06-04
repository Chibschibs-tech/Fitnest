import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { sendWaitlistConfirmationEmail } from "@/lib/email-utils"

const sql = neon(process.env.DATABASE_URL!)

// Function to send admin notification
async function sendAdminNotification(submissionData: any) {
  try {
    const { name, email, phone, mealPlanPreference, city, notifications, id } = submissionData

    // Import nodemailer here to avoid issues
    const nodemailer = require("nodemailer")

    // Create transporter using the same config as email-utils
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    const adminEmail = "chihab.jabri@gmail.com"

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: `New Waitlist Entry - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #015033; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Waitlist Entry</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <h2>New waitlist submission received</h2>
            
            <div style="background-color: #e6f2ed; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #015033;">Customer Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
              <p><strong>City:</strong> ${city || "Not provided"}</p>
              <p><strong>Meal Plan Preference:</strong> ${mealPlanPreference || "Not specified"}</p>
              <p><strong>Notifications:</strong> ${notifications ? "Yes" : "No"}</p>
              <p><strong>Submission ID:</strong> ${id}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p>This customer has been added to the waitlist and should be contacted soon.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fitnest.ma/admin/waitlist" style="background-color: #015033; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View All Waitlist Entries</a>
            </div>
          </div>
          <div style="background-color: #e6f2ed; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Fitnest.ma Admin Notification</p>
          </div>
        </div>
      `,
      text: `New Waitlist Entry - ${name}

Customer Details:
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
City: ${city || "Not provided"}
Meal Plan Preference: ${mealPlanPreference || "Not specified"}
Notifications: ${notifications ? "Yes" : "No"}
Submission ID: ${id}
Date: ${new Date().toLocaleString()}

This customer has been added to the waitlist and should be contacted soon.
`,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Admin notification sent to ${adminEmail} for waitlist entry: ${name}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending admin notification:", error)
    return { success: false, error }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, mealPlanPreference, city, notifications } = body

    console.log("Waitlist submission received:", {
      name,
      email,
      phone,
      mealPlanPreference,
      city,
      notifications,
      timestamp: new Date().toISOString(),
    })

    // Ensure waitlist table exists
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        meal_plan_preference VARCHAR(100),
        city VARCHAR(100),
        notifications BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Insert the submission into the database
    const result = await sql`
      INSERT INTO waitlist (name, email, phone, meal_plan_preference, city, notifications)
      VALUES (${name}, ${email}, ${phone || null}, ${mealPlanPreference || null}, ${city || null}, ${notifications || true})
      RETURNING id
    `

    const submissionId = result[0]?.id
    console.log("Waitlist submission stored in database with ID:", submissionId)

    // Get current waitlist position and estimated wait time
    const positionResult = await sql`
      SELECT COUNT(*) as position FROM waitlist WHERE id <= ${submissionId}
    `
    const position = Number(positionResult[0]?.position || 1)
    const estimatedWait = Math.ceil(position / 10) * 7 // Estimate 7 days per 10 people

    // Send confirmation email to the customer
    try {
      await sendWaitlistConfirmationEmail({
        email,
        name,
        position,
        estimatedWait,
      })
      console.log(`Waitlist confirmation email sent to ${email}`)
    } catch (emailError) {
      console.error("Error sending waitlist confirmation email:", emailError)
    }

    // Send admin notification email
    try {
      await sendAdminNotification({
        name,
        email,
        phone,
        mealPlanPreference,
        city,
        notifications,
        id: submissionId,
      })
      console.log("Admin notification sent successfully")
    } catch (adminEmailError) {
      console.error("Error sending admin notification:", adminEmailError)
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your interest! Your request has been registered. We will contact you by email very soon.",
    })
  } catch (error) {
    console.error("Error processing waitlist submission:", error)

    // Still return success to user, but log the error
    return NextResponse.json({
      success: true,
      message: "Thank you for your interest! Your request has been registered. We will contact you by email very soon.",
    })
  }
}

export async function GET() {
  try {
    // Get waitlist statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as weekly_signups
      FROM waitlist
    `

    return NextResponse.json({
      totalCount: Number.parseInt(stats[0]?.total_count || "0"),
      weeklySignups: Number.parseInt(stats[0]?.weekly_signups || "0"),
    })
  } catch (error) {
    console.error("Waitlist stats error:", error)
    return NextResponse.json({ error: "Failed to get waitlist stats" }, { status: 500 })
  }
}
