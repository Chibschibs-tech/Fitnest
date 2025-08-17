import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("Starting sample data cleanup...")

    const deletedRecords = {
      orders: 0,
      users: 0,
      waitlist: 0,
    }

    try {
      // First, delete orders that reference sample users (to avoid foreign key constraint)
      const sampleUserOrders = await sql`
        DELETE FROM orders 
        WHERE user_id IN (
          SELECT id FROM users 
          WHERE email LIKE '%test%' 
          OR email LIKE '%example%' 
          OR email LIKE '%sample%'
          OR name LIKE '%TEST%'
          OR name LIKE '%Sample%'
        )
        RETURNING id
      `
      deletedRecords.orders = sampleUserOrders.length

      // Then delete sample users
      const sampleUsers = await sql`
        DELETE FROM users 
        WHERE (
          email LIKE '%test%' 
          OR email LIKE '%example%' 
          OR email LIKE '%sample%'
          OR name LIKE '%TEST%'
          OR name LIKE '%Sample%'
        )
        AND role != 'admin'
        RETURNING id
      `
      deletedRecords.users = sampleUsers.length

      // Clean sample waitlist entries
      const sampleWaitlist = await sql`
        DELETE FROM waitlist 
        WHERE email LIKE '%test%' 
        OR email LIKE '%example%' 
        OR email LIKE '%@example.com%'
        OR first_name = 'TEST'
        OR last_name = 'SUBMISSION'
        RETURNING id
      `
      deletedRecords.waitlist = sampleWaitlist.length

      console.log("Sample data cleanup completed:", deletedRecords)

      return NextResponse.json({
        success: true,
        message: "Sample data cleaned successfully",
        deletedRecords,
      })
    } catch (error) {
      console.error("Error during cleanup:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to clean sample data",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error cleaning sample data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clean sample data",
      },
      { status: 500 },
    )
  }
}
