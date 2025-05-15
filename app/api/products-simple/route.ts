import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureProductsExist } from "@/lib/db-utils"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Ensure products exist in the database
    await ensureProductsExist()

    // Get products
    const products = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        saleprice as "salePrice", 
        imageurl as "imageUrl", 
        category,
        tags,
        stock
      FROM products
      WHERE isactive = true OR isactive IS NULL
      ORDER BY id ASC
    `

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
