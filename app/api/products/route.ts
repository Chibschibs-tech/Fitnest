import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Initialize Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Check if products table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      ) as exists
    `

    if (!tableCheck[0].exists) {
      return NextResponse.json(
        {
          error: "Products table does not exist",
          message: "Please initialize the database first",
        },
        { status: 404 },
      )
    }

    // Get all products
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
        stock, 
        isactive as "isActive"
      FROM products
      WHERE isactive = true
      ORDER BY category, name
    `

    // Group products by category
    const productsByCategory = products.reduce((acc, product) => {
      const category = product.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push({
        ...product,
        price: Number.parseInt(product.price),
        salePrice: product.salePrice ? Number.parseInt(product.salePrice) : null,
      })
      return acc
    }, {})

    return NextResponse.json(
      {
        products,
        productsByCategory,
        count: products.length,
      },
      { status: 200 },
    )
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
