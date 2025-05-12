import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    console.log("Simple products API called")

    // Initialize the Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Get all products without filtering by is_active
    const result = await sql`SELECT * FROM products`

    console.log(`Found ${result.length} products`)

    // Log the first product to see its structure
    if (result.length > 0) {
      console.log("First product structure:", Object.keys(result[0]))
      console.log("First product data:", result[0])
    }

    // Transform the data to camelCase for the frontend
    const products = result.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice:
        product.sale_price !== undefined
          ? product.sale_price
          : product.saleprice !== undefined
            ? product.saleprice
            : null,
      imageUrl:
        product.image_url !== undefined ? product.image_url : product.imageurl !== undefined ? product.imageurl : null,
      category: product.category,
      tags: product.tags,
      nutritionalInfo:
        product.nutritional_info !== undefined
          ? product.nutritional_info
          : product.nutritionalinfo !== undefined
            ? product.nutritionalinfo
            : null,
      stock: product.stock,
      isActive:
        product.is_active !== undefined ? product.is_active : product.isactive !== undefined ? product.isactive : true,
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
