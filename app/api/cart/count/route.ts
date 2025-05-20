import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ count: 0 }, { status: 200 })
    }

    // Get user ID
    const userId = session.user.id

    if (!userId) {
      return NextResponse.json({ count: 0 }, { status: 200 })
    }

    // Initialize Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Check if cart_items table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'cart_items'
      ) as exists
    `

    if (!tableCheck[0].exists) {
      return NextResponse.json({ count: 0 }, { status: 200 })
    }

    // Get cart count
    const result = await sql`
      SELECT COUNT(*) as count FROM cart_items WHERE user_id = ${userId}
    `

    return NextResponse.json({ count: result[0].count }, { status: 200 })
  } catch (error) {
    console.error("Error fetching cart count:", error)
    return NextResponse.json({ count: 0 }, { status: 200 })
  }
}
