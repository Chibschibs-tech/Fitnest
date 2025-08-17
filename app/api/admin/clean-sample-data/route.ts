import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("Starting sample data cleanup...")

    const cleanupResults = {
      ordersDeleted: 0,
      usersDeleted: 0,
      waitlistDeleted: 0,
      errors: [],
    }

    try {
      // Step 1: Delete orders for test users to avoid foreign key constraint
      const testUserIds = await sql`
        SELECT id FROM users 
        WHERE 
          email LIKE '%test%' 
          OR email LIKE '%example%' 
          OR email LIKE '%@test.%'
          OR name = 'TEST'
          OR name LIKE 'Test %'
      `

      console.log("Found test users:", testUserIds)

      if (testUserIds.length > 0) {
        const userIdsList = testUserIds.map((u) => u.id)

        // Delete orders for these users first
        const deletedOrders = await sql`
          DELETE FROM orders 
          WHERE user_id = ANY(${userIdsList})
          RETURNING id
        `
        cleanupResults.ordersDeleted = deletedOrders.length
        console.log(`Deleted ${deletedOrders.length} orders`)

        // Now delete the test users
        const deletedUsers = await sql`
          DELETE FROM users 
          WHERE id = ANY(${userIdsList})
          RETURNING id
        `
        cleanupResults.usersDeleted = deletedUsers.length
        console.log(`Deleted ${deletedUsers.length} test users`)
      }
    } catch (error) {
      console.error("Error cleaning user data:", error)
      cleanupResults.errors.push(`User cleanup error: ${error.message}`)
    }

    try {
      // Step 2: Clean waitlist test entries
      const deletedWaitlist = await sql`
        DELETE FROM waitlist 
        WHERE 
          email LIKE '%test%' 
          OR email LIKE '%example%' 
          OR name = 'TEST'
          OR name LIKE 'Test %'
          OR email LIKE '%@test.%'
          OR last_name = 'SUBMISSION'
        RETURNING id
      `
      cleanupResults.waitlistDeleted = deletedWaitlist.length
      console.log(`Deleted ${deletedWaitlist.length} test waitlist entries`)
    } catch (error) {
      console.error("Error cleaning waitlist:", error)
      cleanupResults.errors.push(`Waitlist cleanup error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: "Sample data cleanup completed",
      results: cleanupResults,
    })
  } catch (error) {
    console.error("Error during cleanup:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clean sample data",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
