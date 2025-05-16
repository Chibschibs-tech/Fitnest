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

    // Check if cart table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'cart'
      ) as exists
    `

    if (!tableExists[0].exists) {
      return NextResponse.json({ count: 0 })
    }

    // Get cart count
    const result = await sql`
      SELECT SUM(quantity) as count FROM cart WHERE id = ${cartId}
    `

    const count = result[0]?.count ? Number(result[0].count) : 0

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error getting cart count:", error)
    return NextResponse.json({ count: 0 })
  }
}
