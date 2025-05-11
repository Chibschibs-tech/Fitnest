import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    console.log("Simple products API called")

    // Initialize the Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Get all products using a simple query
    const result = await sql`SELECT * FROM products WHERE is_active = true`

    console.log(`Found ${result.length} products`)

    // Transform the data to camelCase for the frontend
    const products = result.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.sale_price,
      imageUrl: product.image_url,
      category: product.category,
      tags: product.tags,
      nutritionalInfo: product.nutritional_info,
      stock: product.stock,
    }))

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in simple products API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
