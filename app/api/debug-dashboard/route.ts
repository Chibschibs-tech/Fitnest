import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    // Check all cookies
    const allCookies = {}
    cookieStore.getAll().forEach((cookie) => {
      allCookies[cookie.name] = cookie.value
    })

    // Check database structure
    const tables = await sql`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'sessions', 'orders', 'meal_plans')
      ORDER BY table_name, ordinal_position
    `

    // Check if we have any users
    const userCount = await sql`SELECT COUNT(*) as count FROM users`

    // Check if we have any orders
    let orderCount = []
    try {
      orderCount = await sql`SELECT COUNT(*) as count FROM orders`
    } catch (e) {
      orderCount = [{ count: "table does not exist" }]
    }

    // Check sessions table
    let sessionCount = []
    try {
      sessionCount = await sql`SELECT COUNT(*) as count FROM sessions`
    } catch (e) {
      sessionCount = [{ count: "table does not exist" }]
    }

    return NextResponse.json({
      cookies: allCookies,
      sessionId,
      tables: tables.reduce((acc, row) => {
        if (!acc[row.table_name]) acc[row.table_name] = []
        acc[row.table_name].push({ column: row.column_name, type: row.data_type })
        return acc
      }, {}),
      counts: {
        users: userCount[0]?.count,
        orders: orderCount[0]?.count,
        sessions: sessionCount[0]?.count,
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    })
  }
}
