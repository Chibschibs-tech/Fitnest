import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

// Helper function to get user ID directly from the session token
async function getUserIdFromSessionToken() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("next-auth.session-token")?.value

  if (!sessionToken) {
    throw new Error("No session token found")
  }

  const sql = neon(process.env.DATABASE_URL!)

  // Try to get the user from the sessions table
  const sessions = await sql`
    SELECT * FROM sessions WHERE session_token = ${sessionToken} LIMIT 1
  `

  if (sessions.length === 0) {
    throw new Error("Session not found")
  }

  const session = sessions[0]

  // Get the user from the users table
  const users = await sql`
    SELECT * FROM users WHERE id = ${session.user_id} LIMIT 1
  `

  if (users.length === 0) {
    throw new Error("User not found")
  }

  return users[0].id
}

export async function GET() {
  try {
    let userId

    try {
      userId = await getUserIdFromSessionToken()
    } catch (error) {
      console.error("Error getting user ID from session token:", error)
      return NextResponse.json({ count: 0 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // First, check if the cart_items table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const cartTableExists = tables.some((t) => t.table_name === "cart_items")

    if (!cartTableExists) {
      return NextResponse.json({ count: 0 })
    }

    // Count cart items for the user
    const result = await sql`
      SELECT SUM(quantity) as count
      FROM cart_items
      WHERE user_id = ${userId}
    `

    const count = Number(result[0]?.count || 0)

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching cart count directly:", error)
    return NextResponse.json({ count: 0 })
  }
}
