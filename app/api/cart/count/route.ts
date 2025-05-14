import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const sql = neon(process.env.DATABASE_URL!)

    // First, check if the cart_items table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const cartTableExists = tables.some((t) => t.table_name === "cart_items")

    if (!cartTableExists) {
      console.log("Cart table doesn't exist for count")
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
    console.error("Error fetching cart count:", error)
    return NextResponse.json({
      count: 0,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
