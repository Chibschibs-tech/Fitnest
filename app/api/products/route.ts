import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Force dynamic to prevent caching issues
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 20

    // Build query based on parameters - Fix column names to match database schema
    let query = `
      SELECT 
        id, 
        name, 
        description, 
        price, 
        sale_price as "salePrice", 
        image_url as "imageUrl", 
        category,
        tags,
        stock
      FROM products
      WHERE isactive = true
    `

    const queryParams: any[] = []

    if (category) {
      query += ` AND category = $1`
      queryParams.push(category)
    }

    query += ` ORDER BY id ASC LIMIT $${queryParams.length + 1}`
    queryParams.push(limit)

    // Execute query
    const products = await sql.query(query, queryParams)

    return NextResponse.json(products.rows)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price, and category are required" },
        { status: 400 },
      )
    }

    // Insert the new product - Fix column names to match database schema
    const newProduct = await sql`
      INSERT INTO products
      (name, description, price, sale_price, image_url, category, tags, nutritional_info, stock, isactive)
      VALUES
      (${data.name}, ${data.description}, ${data.price}, ${data.salePrice || null},
       ${data.imageUrl || null}, ${data.category}, ${data.tags || null},
       ${data.nutritionalInfo ? JSON.stringify(data.nutritionalInfo) : null}::jsonb,
       ${data.stock || 0}, ${data.isActive !== undefined ? data.isActive : true})
      RETURNING *
    `

    // Transform column names for frontend consistency
    const product = newProduct[0]
    return NextResponse.json(
      {
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
        isActive: product.isactive,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
