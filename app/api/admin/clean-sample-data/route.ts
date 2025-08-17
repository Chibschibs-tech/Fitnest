import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
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
      cart_items: 0,
    }

    try {
      // Step 1: Delete orders for sample users first (to avoid foreign key constraint)
      const sampleUserOrders = await sql`
        DELETE FROM orders 
        WHERE user_id IN (
          SELECT id FROM users 
          WHERE email LIKE '%@example.com' 
          OR email LIKE 'test-%'
          OR name LIKE 'TEST%'
          OR name = 'Sample User'
        )
      `
      deletedRecords.orders = sampleUserOrders.length || 0
      console.log(`Deleted ${deletedRecords.orders} sample orders`)

      // Step 2: Delete cart items for sample users
      const sampleCartItems = await sql`
        DELETE FROM cart_items 
        WHERE user_id IN (
          SELECT id FROM users 
          WHERE email LIKE '%@example.com' 
          OR email LIKE 'test-%'
          OR name LIKE 'TEST%'
          OR name = 'Sample User'
        )
      `
      deletedRecords.cart_items = sampleCartItems.length || 0
      console.log(`Deleted ${deletedRecords.cart_items} sample cart items`)

      // Step 3: Delete sample users
      const sampleUsers = await sql`
        DELETE FROM users 
        WHERE email LIKE '%@example.com' 
        OR email LIKE 'test-%'
        OR name LIKE 'TEST%'
        OR name = 'Sample User'
      `
      deletedRecords.users = sampleUsers.length || 0
      console.log(`Deleted ${deletedRecords.users} sample users`)

      // Step 4: Delete sample waitlist entries
      const sampleWaitlist = await sql`
        DELETE FROM waitlist 
        WHERE email LIKE '%@example.com' 
        OR email LIKE 'test-%'
        OR first_name LIKE 'TEST%'
        OR last_name = 'SUBMISSION'
      `
      deletedRecords.waitlist = sampleWaitlist.length || 0
      console.log(`Deleted ${deletedRecords.waitlist} sample waitlist entries`)

      // Step 5: Get current counts
      const currentCounts = await sql`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE role != 'admin' OR role IS NULL) as users_count,
          (SELECT COUNT(*) FROM orders) as orders_count,
          (SELECT COUNT(*) FROM waitlist) as waitlist_count
      `

      return NextResponse.json({
        success: true,
        message: "Sample data cleaned successfully",
        deleted: deletedRecords,
        remaining: {
          users: Number(currentCounts[0]?.users_count || 0),
          orders: Number(currentCounts[0]?.orders_count || 0),
          waitlist: Number(currentCounts[0]?.waitlist_count || 0),
        },
      })
    } catch (error) {
      console.error("Error during cleanup:", error)
      return NextResponse.json({
        success: false,
        error: `Cleanup failed: ${error.message}`,
        deleted: deletedRecords,
      })
    }
  } catch (error) {
    console.error("Error cleaning sample data:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to clean sample data",
    })
  }
}
