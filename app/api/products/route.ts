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

    // Build query based on parameters - using the correct column names
    // First, let's check the actual column names in the database
    const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products'
    `

    // Log column names for debugging
    console.log(
      "Product table columns:",
      columnCheck.map((col) => col.column_name),
    )

    // Build query with appropriate column names
    // We'll check both possible column naming conventions (with and without underscores)
    let query = `
      SELECT 
        id, 
        name, 
        description, 
        price
    `

    // Add conditional columns based on what exists in the database
    const columnNames = columnCheck.map((col) => col.column_name)

    if (columnNames.includes("sale_price")) {
      query += `, sale_price as "salePrice"`
    } else if (columnNames.includes("saleprice")) {
      query += `, saleprice as "salePrice"`
    }

    if (columnNames.includes("image_url")) {
      query += `, image_url as "imageUrl"`
    } else if (columnNames.includes("imageurl")) {
      query += `, imageurl as "imageUrl"`
    }

    if (columnNames.includes("category")) {
      query += `, category`
    }

    if (columnNames.includes("stock")) {
      query += `, stock`
    }

    if (columnNames.includes("tags")) {
      query += `, tags`
    }

    // Complete the query
    query += `
      FROM products
      WHERE 1=1
    `

    // Check if the table has an isactive or is_active column
    if (columnNames.includes("isactive")) {
      query += ` AND isactive = true`
    } else if (columnNames.includes("is_active")) {
      query += ` AND is_active = true`
    }

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

    // Check the actual column names in the database
    const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products'
    `

    const columnNames = columnCheck.map((col) => col.column_name)

    // Determine the correct column names for insert
    const salePriceCol = columnNames.includes("sale_price") ? "sale_price" : "saleprice"
    const imageUrlCol = columnNames.includes("image_url") ? "image_url" : "imageurl"
    const isActiveCol = columnNames.includes("is_active") ? "is_active" : "isactive"
    const nutritionalInfoCol = columnNames.includes("nutritional_info") ? "nutritional_info" : "nutritionalinfo"

    // Build a dynamic insert query with the correct column names
    let insertQuery = `
      INSERT INTO products
      (name, description, price, ${salePriceCol}, ${imageUrlCol}, category
    `

    if (columnNames.includes("tags")) {
      insertQuery += `, tags`
    }

    if (columnNames.includes(nutritionalInfoCol)) {
      insertQuery += `, ${nutritionalInfoCol}`
    }

    if (columnNames.includes("stock")) {
      insertQuery += `, stock`
    }

    if (columnNames.includes(isActiveCol)) {
      insertQuery += `, ${isActiveCol}`
    }

    insertQuery += `)
      VALUES
      ($1, $2, $3, $4, $5, $6
    `

    // Parameters array
    const params = [
      data.name,
      data.description,
      data.price,
      data.salePrice || null,
      data.imageUrl || null,
      data.category,
    ]

    let paramCount = 6

    if (columnNames.includes("tags")) {
      insertQuery += `, $${++paramCount}`
      params.push(data.tags || null)
    }

    if (columnNames.includes(nutritionalInfoCol)) {
      insertQuery += `, $${++paramCount}`
      params.push(data.nutritionalInfo ? JSON.stringify(data.nutritionalInfo) : null)
    }

    if (columnNames.includes("stock")) {
      insertQuery += `, $${++paramCount}`
      params.push(data.stock || 0)
    }

    if (columnNames.includes(isActiveCol)) {
      insertQuery += `, $${++paramCount}`
      params.push(data.isActive !== undefined ? data.isActive : true)
    }

    insertQuery += `) RETURNING *`

    // Execute the insert query
    const newProduct = await sql.query(insertQuery, params)

    // Transform column names for frontend consistency
    const product = newProduct.rows[0]
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product[salePriceCol] || product.saleprice || product.sale_price,
      imageUrl: product[imageUrlCol] || product.imageurl || product.image_url,
      category: product.category,
    }

    if (product.tags) transformedProduct.tags = product.tags
    if (product.stock) transformedProduct.stock = product.stock
    if (product[nutritionalInfoCol] || product.nutritionalinfo || product.nutritional_info) {
      transformedProduct.nutritionalInfo =
        product[nutritionalInfoCol] || product.nutritionalinfo || product.nutritional_info
    }

    return NextResponse.json(transformedProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        error: "Failed to create product",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
