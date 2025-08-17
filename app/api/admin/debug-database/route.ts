import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("Starting database diagnostic...")

    // Check what tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log("Available tables:", tables)

    // Check users table structure and content
    let usersInfo = { structure: [], count: 0, sample: [] }
    try {
      const usersStructure = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `

      const usersCount = await sql`SELECT COUNT(*) as count FROM users`

      const usersSample = await sql`
        SELECT id, name, email, role, created_at
        FROM users
        LIMIT 5
      `

      usersInfo = {
        structure: usersStructure,
        count: Number(usersCount[0]?.count || 0),
        sample: usersSample,
      }
    } catch (error) {
      console.log("Error checking users table:", error)
    }

    // Check orders table structure and content
    let ordersInfo = { structure: [], count: 0, sample: [] }
    try {
      const ordersStructure = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'orders'
        ORDER BY ordinal_position
      `

      const ordersCount = await sql`SELECT COUNT(*) as count FROM orders`

      const ordersSample = await sql`
        SELECT id, user_id, total, total_amount, status, created_at
        FROM orders
        LIMIT 5
      `

      ordersInfo = {
        structure: ordersStructure,
        count: Number(ordersCount[0]?.count || 0),
        sample: ordersSample,
      }
    } catch (error) {
      console.log("Error checking orders table:", error)
    }

    // Check waitlist table (might have customer data)
    let waitlistInfo = { structure: [], count: 0, sample: [] }
    try {
      const waitlistStructure = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'waitlist'
        ORDER BY ordinal_position
      `

      const waitlistCount = await sql`SELECT COUNT(*) as count FROM waitlist`

      const waitlistSample = await sql`
        SELECT id, name, email, phone, city, created_at
        FROM waitlist
        LIMIT 5
      `

      waitlistInfo = {
        structure: waitlistStructure,
        count: Number(waitlistCount[0]?.count || 0),
        sample: waitlistSample,
      }
    } catch (error) {
      console.log("Error checking waitlist table:", error)
    }

    return NextResponse.json({
      success: true,
      diagnostic: {
        tables: tables.map((t) => t.table_name),
        users: usersInfo,
        orders: ordersInfo,
        waitlist: waitlistInfo,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Database diagnostic error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      diagnostic: null,
    })
  }
}
