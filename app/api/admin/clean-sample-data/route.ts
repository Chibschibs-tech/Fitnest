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

    // Delete users with sample emails
    for (const email of sampleEmails) {
      const result = await sql`
        DELETE FROM users 
        WHERE email = ${email}
        AND role != 'admin'
      `
      deletedCount += result.length
    }

    // Delete users with sample names
    for (const name of sampleNames) {
      const result = await sql`
        DELETE FROM users 
        WHERE name = ${name}
        AND role != 'admin'
      `
      deletedCount += result.length
    }

    // Also clean any orders from deleted users
    await sql`
      DELETE FROM orders 
      WHERE user_id NOT IN (SELECT id FROM users)
    `

    // Get remaining user count
    const remainingUsers = await sql`SELECT COUNT(*) as count FROM users`
    const userCount = Number(remainingUsers[0]?.count || 0)

    console.log(`Cleaned ${deletedCount} sample users, ${userCount} users remaining`)

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned sample data. Removed ${deletedCount} sample users.`,
      remainingUsers: userCount,
    })
  } catch (error) {
    console.error("Error cleaning sample data:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}
