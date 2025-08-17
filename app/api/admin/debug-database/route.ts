import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("Starting database diagnostic...")

    // Get all table names
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    const tables = tablesResult.map((row) => row.table_name)

    // Get users table info
    let users = { structure: [], count: 0, sample: [] }
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
        ORDER BY created_at DESC
        LIMIT 10
      `

      users = {
        structure: usersStructure,
        count: Number(usersCount[0]?.count || 0),
        sample: usersSample,
      }
    } catch (error) {
      console.log("Error getting users data:", error)
    }

    // Get orders table info
    let orders = { structure: [], count: 0, sample: [] }
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
        ORDER BY created_at DESC
        LIMIT 10
      `

      orders = {
        structure: ordersStructure,
        count: Number(ordersCount[0]?.count || 0),
        sample: ordersSample,
      }
    } catch (error) {
      console.log("Error getting orders data:", error)
    }

    // Get waitlist table info - try multiple approaches
    let waitlist = { structure: [], count: 0, sample: [] }
    try {
      const waitlistStructure = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'waitlist'
        ORDER BY ordinal_position
      `

      const waitlistCount = await sql`SELECT COUNT(*) as count FROM waitlist`

      // Try different column combinations for waitlist
      let waitlistSample = []
      try {
        waitlistSample = await sql`
          SELECT id, first_name, last_name, email, phone, city, created_at
          FROM waitlist
          ORDER BY created_at DESC
          LIMIT 10
        `
      } catch (e1) {
        try {
          waitlistSample = await sql`
            SELECT id, name, email, phone, city, created_at
            FROM waitlist
            ORDER BY created_at DESC
            LIMIT 10
          `
        } catch (e2) {
          try {
            waitlistSample = await sql`
              SELECT *
              FROM waitlist
              ORDER BY created_at DESC
              LIMIT 10
            `
          } catch (e3) {
            console.log("All waitlist sample queries failed:", e3)
          }
        }
      }

      waitlist = {
        structure: waitlistStructure,
        count: Number(waitlistCount[0]?.count || 0),
        sample: waitlistSample,
      }
    } catch (error) {
      console.log("Error getting waitlist data:", error)
    }

    return NextResponse.json({
      success: true,
      diagnostic: {
        tables,
        users,
        orders,
        waitlist,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Database diagnostic error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}
