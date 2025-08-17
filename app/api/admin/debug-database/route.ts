import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get all table names
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    const tables = tablesResult.map((row) => row.table_name)

    // Get users count and sample data
    const usersCount = await sql`SELECT COUNT(*) as count FROM users`
    const userCount = Number(usersCount[0]?.count || 0)

    const usersData = await sql`
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 20
    `

    // Get waitlist count and sample data
    const waitlistCount = await sql`SELECT COUNT(*) as count FROM waitlist`
    const waitlistCountNum = Number(waitlistCount[0]?.count || 0)

    const waitlistData = await sql`
      SELECT id, first_name, last_name, email, phone, city, created_at
      FROM waitlist 
      ORDER BY created_at DESC 
      LIMIT 20
    `

    // Get orders count
    const ordersCount = await sql`SELECT COUNT(*) as count FROM orders`
    const ordersCountNum = Number(ordersCount[0]?.count || 0)

    const ordersData = await sql`
      SELECT id, user_id, status, total_amount, created_at
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 20
    `

    return NextResponse.json({
      success: true,
      tables,
      userCount,
      waitlistCount: waitlistCountNum,
      ordersCount: ordersCountNum,
      users: usersData,
      waitlist: waitlistData,
      orders: ordersData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database diagnostic error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}
