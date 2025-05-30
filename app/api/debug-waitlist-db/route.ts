import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Check authentication
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "No session found" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Check what tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%waitlist%'
      ORDER BY table_name
    `

    // Check all tables to see if there are any waitlist-related ones
    const allTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Check the structure of the waitlist table if it exists
    let waitlistStructure = null
    try {
      waitlistStructure = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'waitlist'
        ORDER BY ordinal_position
      `
    } catch (error) {
      console.log("Waitlist table doesn't exist or error checking structure")
    }

    // Get sample data from waitlist table
    let waitlistData = null
    try {
      waitlistData = await sql`
        SELECT * FROM waitlist 
        ORDER BY created_at DESC 
        LIMIT 5
      `
    } catch (error) {
      console.log("Error getting waitlist data:", error.message)
    }

    // Check if there's a different waitlist table
    let waitlistEntriesData = null
    try {
      waitlistEntriesData = await sql`
        SELECT * FROM waitlist_entries 
        ORDER BY created_at DESC 
        LIMIT 5
      `
    } catch (error) {
      console.log("waitlist_entries table doesn't exist")
    }

    // Check users table for comparison
    let usersData = null
    try {
      usersData = await sql`
        SELECT id, name, email, role, created_at FROM users 
        ORDER BY created_at DESC 
        LIMIT 5
      `
    } catch (error) {
      console.log("Error getting users data")
    }

    return NextResponse.json({
      waitlistTables: tables,
      allTables: allTables.map((t) => t.table_name),
      waitlistStructure,
      waitlistData,
      waitlistEntriesData,
      usersData,
      debug: {
        waitlistDataCount: waitlistData?.length || 0,
        waitlistEntriesCount: waitlistEntriesData?.length || 0,
        usersCount: usersData?.length || 0,
      },
    })
  } catch (error) {
    console.error("Database debug error:", error)
    return NextResponse.json({ error: "Database debug failed", details: error.message }, { status: 500 })
  }
}
