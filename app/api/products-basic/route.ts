import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Initialize the Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Simple query with minimal fields
    const productData = await sql`
      SELECT id, name, price
      FROM products
      LIMIT 10
    `

    return NextResponse.json(productData || [])
  } catch (error) {
    console.error("Error in basic products API:", error)
    // Return empty array on error
    return NextResponse.json([])
  }
}
