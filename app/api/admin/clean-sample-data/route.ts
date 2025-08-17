import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("Cleaning sample data...")

    // List of sample/fake emails to remove
    const sampleEmails = [
      "sara@example.com",
      "karim@example.com",
      "leila@example.com",
      "omar@example.com",
      "admin@example.com",
      "test@example.com",
      "demo@example.com",
      "sample@example.com",
    ]

    // Also remove users with obviously fake names
    const sampleNames = [
      "Sara Lamouri",
      "Karim Mansouri",
      "Leila Bennani",
      "Omar Alaoui",
      "Admin User",
      "Test User",
      "Demo User",
      "Sample User",
    ]

    let deletedCount = 0

    // FIRST: Delete orders from sample users to avoid foreign key constraint
    for (const email of sampleEmails) {
      await sql`
        DELETE FROM orders 
        WHERE user_id IN (
          SELECT id FROM users WHERE email = ${email} AND role != 'admin'
        )
      `
    }

    for (const name of sampleNames) {
      await sql`
        DELETE FROM orders 
        WHERE user_id IN (
          SELECT id FROM users WHERE name = ${name} AND role != 'admin'
        )
      `
    }

    // THEN: Delete users with sample emails
    for (const email of sampleEmails) {
      const result = await sql`
        DELETE FROM users 
        WHERE email = ${email}
        AND role != 'admin'
        RETURNING id
      `
      deletedCount += result.length
    }

    // Delete users with sample names
    for (const name of sampleNames) {
      const result = await sql`
        DELETE FROM users 
        WHERE name = ${name}
        AND role != 'admin'
        RETURNING id
      `
      deletedCount += result.length
    }

    // Clean waitlist sample data too
    const waitlistSampleEmails = [
      "test-1754423527708@example.com",
      "test-1754423441918@example.com",
      "test-1754423476123@example.com",
      "test-1754474414428@example.com",
      "test-1754474580058@example.com",
    ]

    let waitlistDeleted = 0
    for (const email of waitlistSampleEmails) {
      const result = await sql`
        DELETE FROM waitlist 
        WHERE email = ${email}
        RETURNING id
      `
      waitlistDeleted += result.length
    }

    // Also clean entries with "TEST" names
    const testResult = await sql`
      DELETE FROM waitlist 
      WHERE first_name = 'TEST' OR last_name = 'SUBMISSION'
      RETURNING id
    `
    waitlistDeleted += testResult.length

    // Get remaining counts
    const remainingUsers = await sql`SELECT COUNT(*) as count FROM users`
    const remainingWaitlist = await sql`SELECT COUNT(*) as count FROM waitlist`
    const userCount = Number(remainingUsers[0]?.count || 0)
    const waitlistCount = Number(remainingWaitlist[0]?.count || 0)

    console.log(`Cleaned ${deletedCount} sample users and ${waitlistDeleted} waitlist entries`)

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned sample data. Removed ${deletedCount} sample users and ${waitlistDeleted} waitlist entries.`,
      remainingUsers: userCount,
      remainingWaitlist: waitlistCount,
    })
  } catch (error) {
    console.error("Error cleaning sample data:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}
