import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Force dynamic to prevent caching issues
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // First, check if the products table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists
    `

    if (!tableCheck[0].exists) {
      return NextResponse.json({
        success: false,
        error: "Products table does not exist",
        products: [],
      })
    }

    // Check the actual column names in the products table
    const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'products'
    `

    const columns = columnCheck.map((col) => col.column_name)
    console.log("Available columns:", columns)

    // Dynamically build the query based on available columns
    let selectClause = "SELECT id, name, description, price"

    if (columns.includes("saleprice")) {
      selectClause += ', saleprice as "salePrice"'
    } else if (columns.includes("sale_price")) {
      selectClause += ', sale_price as "salePrice"'
    }

    if (columns.includes("imageurl")) {
      selectClause += ', imageurl as "imageUrl"'
    } else if (columns.includes("image_url")) {
      selectClause += ', image_url as "imageUrl"'
    }

    if (columns.includes("category")) {
      selectClause += ", category"
    }

    if (columns.includes("tags")) {
      selectClause += ", tags"
    }

    if (columns.includes("stock")) {
      selectClause += ", stock"
    }

    let whereClause = ""
    if (columns.includes("isactive")) {
      whereClause = "WHERE isactive = true"
    } else if (columns.includes("is_active")) {
      whereClause = "WHERE is_active = true"
    }

    const query = `
      ${selectClause}
      FROM products
      ${whereClause}
      ORDER BY id ASC
      LIMIT 100
    `

    console.log("Executing query:", query)

    // Execute the query
    const products = await sql.query(query)

    // Log the first product for debugging
    if (products.rows.length > 0) {
      console.log("First product:", products.rows[0])
    } else {
      console.log("No products found")
    }

    return NextResponse.json(products.rows)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error),
        products: [],
      },
      { status: 500 },
    )
  }
}
