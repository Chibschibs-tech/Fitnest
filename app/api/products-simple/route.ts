import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Initialize the Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Simple query to get all products
    const productData = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        saleprice as "salePrice", 
        imageurl as "imageUrl", 
        category
      FROM products
      WHERE stock > 0
      LIMIT 100
    `

    // Return empty array instead of undefined if no products found
    return NextResponse.json(productData || [])
  } catch (error) {
    console.error("Error fetching products:", error)
    // Return empty array on error to avoid breaking the UI
    return NextResponse.json([])
  }
}
