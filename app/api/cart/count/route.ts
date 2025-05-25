import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

// Force dynamic rendering to avoid caching issues
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get("cartId")?.value

    if (!cartId) {
      return NextResponse.json({ count: 0 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if cart_items table exists first
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'cart_items'
      ) as exists
    `

    if (!tableExists[0].exists) {
      return NextResponse.json({ count: 0 })
    }

    // Get cart count from cart_items table
    const result = await sql`
      SELECT COALESCE(SUM(quantity), 0) as count 
      FROM cart_items 
      WHERE cart_id = ${cartId}
    `

    const count = Number(result[0]?.count) || 0

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error getting cart count:", error)
    return NextResponse.json({ count: 0 }, { status: 200 }) // Return 0 instead of error
  }
}
