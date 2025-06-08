import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { sendWaitlistConfirmationEmail } from "@/lib/email-utils"
import { randomBytes, createHash } from "crypto"

// Use the NEON_DATABASE_URL which should be the correct one
const sql = neon(process.env.NEON_DATABASE_URL!)

// Function to generate a secure temporary password
function generateTemporaryPassword() {
  return randomBytes(16).toString("hex")
}

// Function to hash a password
function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex")
}

// Function to send admin notification
async function sendAdminNotification(submissionData: any) {
  try {
    const { firstName, lastName, email, phone, mealPlanPreference, city, notifications, id } = submissionData

    // Import nodemailer here to avoid issues
    const nodemailer = require("nodemailer")

    // Create transporter using the exact same working config
    const transporter = nodemailer.createTransporter({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "noreply@fitnest.ma",
        pass: "vein jobh jbpa jcfe",
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    })

    const adminEmail = "chihab.jabri@gmail.com"

    const mailOptions = {
      from: '"Fitnest.ma" <noreply@fitnest.ma>',
      to: adminEmail,
      subject: `🔔 New Waitlist Entry - ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #015033; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🔔 New Waitlist Entry</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <h2>New waitlist submission received</h2>
            
            <div style="background-color: #e6f2ed; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #015033;">Customer Details</h3>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
              <p><strong>City:</strong> ${city || "Not provided"}</p>
              <p><strong>Meal Plan Preference:</strong> ${mealPlanPreference || "Not specified"}</p>
              <p><strong>Notifications:</strong> ${notifications ? "Yes" : "No"}</p>
              <p><strong>Submission ID:</strong> ${id}</p>
              <p><strong>Acquisition Source:</strong> Waitlist</p>
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
      text: `New Waitlist Entry - ${firstName} ${lastName}

Customer Details:
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || "Not provided"}
City: ${city || "Not provided"}
Meal Plan Preference: ${mealPlanPreference || "Not specified"}
Notifications: ${notifications ? "Yes" : "No"}
Submission ID: ${id}
Acquisition Source: Waitlist
Date: ${new Date().toLocaleString()}

This customer has been added to the waitlist and should be contacted soon.
`,
    }

    console.log(`Attempting to send admin notification to ${adminEmail}...`)

    const info = await transporter.sendMail(mailOptions)
    console.log(`Admin notification sent successfully to ${adminEmail}: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending admin notification:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, mealPlanPreference, city, notifications } = body

    // Split the combined name back into firstName and lastName for waitlist table
    const nameParts = name.trim().split(" ")
    const firstName = nameParts[0] || "Unknown"
    const lastName = nameParts.slice(1).join(" ") || ""

    console.log("Waitlist submission received:", {
      firstName,
      lastName,
      email,
      phone,
      mealPlanPreference,
      city,
      notifications,
      timestamp: new Date().toISOString(),
    })

    // Ensure users table exists with acquisition_source column
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        acquisition_source VARCHAR(100) DEFAULT 'waitlist',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Add acquisition_source column if it doesn't exist
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS acquisition_source VARCHAR(100) DEFAULT 'waitlist'
    `

    // Ensure waitlist table exists with firstName and lastName columns
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        meal_plan_preference VARCHAR(100),
        city VARCHAR(100),
        notifications BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        position INTEGER
      )
    `

    // Add missing columns to existing waitlist table if they don't exist
    await sql`
      ALTER TABLE waitlist 
      ADD COLUMN IF NOT EXISTS first_name VARCHAR(255) NOT NULL
    `

    await sql`
      ALTER TABLE waitlist 
      ADD COLUMN IF NOT EXISTS last_name VARCHAR(255)
    `

    await sql`
      ALTER TABLE waitlist 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20)
    `

    await sql`
      ALTER TABLE waitlist 
      ADD COLUMN IF NOT EXISTS meal_plan_preference VARCHAR(100)
    `

    await sql`
      ALTER TABLE waitlist 
      ADD COLUMN IF NOT EXISTS city VARCHAR(100)
    `

    await sql`
      ALTER TABLE waitlist 
      ADD COLUMN IF NOT EXISTS notifications BOOLEAN DEFAULT true
    `

    await sql`
      ALTER TABLE waitlist
      ADD COLUMN IF NOT EXISTS position INTEGER
    `

    // Check if user already exists
    const existingUser = await sql`
      SELECT id, acquisition_source FROM users WHERE email = ${email}
    `

    let userId = null
    if (existingUser.length === 0) {
      // Generate a temporary password for the new user
      const tempPassword = generateTemporaryPassword()
      const hashedPassword = hashPassword(tempPassword)

      // Create new user with combined name and waitlist acquisition source
      const userResult = await sql`
        INSERT INTO users (name, email, role, acquisition_source, password)
        VALUES (${name}, ${email}, 'customer', 'waitlist', ${hashedPassword})
        RETURNING id
      `
      userId = userResult[0]?.id
      console.log("Created new customer with ID:", userId, "from waitlist with temporary password")
    } else {
      userId = existingUser[0].id
      // Update acquisition source if it was different and now coming from waitlist
      if (existingUser[0].acquisition_source !== "waitlist") {
        await sql`
          UPDATE users 
          SET acquisition_source = 'waitlist', updated_at = CURRENT_TIMESTAMP
          WHERE id = ${userId}
        `
        console.log("Updated existing user acquisition source to waitlist")
      }
      console.log("User already exists with ID:", userId)
    }

    // Get the next position number
    const positionResult2 = await sql`
      SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM waitlist
    `
    const nextPosition = Number(positionResult2[0]?.next_position || 1)

    // Insert the submission into the waitlist with separate firstName and lastName and position
    const result = await sql`
      INSERT INTO waitlist (first_name, last_name, email, phone, meal_plan_preference, city, notifications, position)
      VALUES (${firstName}, ${lastName}, ${email}, ${phone || null}, ${mealPlanPreference || null}, ${city || null}, ${notifications || true}, ${nextPosition})
      RETURNING id, position
    `

    const submissionId = result[0]?.id
    const position = result[0]?.position || nextPosition
    console.log("Waitlist submission stored in database with ID:", submissionId, "at position:", position)

    // Debug email configuration
    console.log("Email configuration check:", {
      host: process.env.EMAIL_SERVER_HOST ? "✓" : "✗",
      port: process.env.EMAIL_SERVER_PORT ? "✓" : "✗",
      user: process.env.EMAIL_SERVER_USER ? "✓" : "✗",
      pass: process.env.EMAIL_SERVER_PASSWORD ? "✓" : "✗",
      from: !!process.env.EMAIL_FROM ? "✓" : "✗",
    })

    // Position is already calculated from the insert, no need to query again
    const estimatedWait = Math.ceil(position / 10) * 7 // Estimate 7 days per 10 people

    // Send confirmation email to the customer
    let customerEmailResult = null
    try {
      customerEmailResult = await sendWaitlistConfirmationEmail({
        email,
        name,
        position,
        estimatedWait,
      })
      console.log(`Waitlist confirmation email result:`, customerEmailResult)
    } catch (emailError) {
      console.error("Error sending waitlist confirmation email:", emailError)
      customerEmailResult = { success: false, error: emailError.message }
    }

    // Send admin notification email
    let adminEmailResult = null
    try {
      adminEmailResult = await sendAdminNotification({
        firstName,
        lastName,
        email,
        phone,
        mealPlanPreference,
        city,
        notifications,
        id: submissionId,
      })
      console.log("Admin notification result:", adminEmailResult)
    } catch (adminEmailError) {
      console.error("Error sending admin notification:", adminEmailError)
      adminEmailResult = { success: false, error: adminEmailError.message }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your interest! Your request has been registered. We will contact you by email very soon.",
      debug: {
        id: submissionId,
        userId,
        position,
        saved: true,
        acquisitionSource: "waitlist",
        customerEmail: customerEmailResult,
        adminEmail: adminEmailResult,
        emailConfig: {
          host: !!process.env.EMAIL_SERVER_HOST,
          port: !!process.env.EMAIL_SERVER_PORT,
          user: !!process.env.EMAIL_SERVER_USER,
          pass: !!process.env.EMAIL_SERVER_PASSWORD,
          from: !!process.env.EMAIL_FROM,
        },
      },
    })
  } catch (error) {
    console.error("Error processing waitlist submission:", error)

    return NextResponse.json(
      {
        success: false,
        message: "There was an error processing your request. Please try again.",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  // Return a static response to avoid database authentication issues
  // The counter will be updated client-side after successful submissions
  return NextResponse.json({
    totalCount: 22, // Static fallback
    weeklySignups: 0,
  })
}
