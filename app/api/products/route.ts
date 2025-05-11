import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    // Initialize the Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const id = searchParams.get("id")

    let productData

    if (id) {
      // Get a specific product by ID
      productData = await sql`
        SELECT * FROM products 
        WHERE id = ${Number.parseInt(id)}
        LIMIT 1
      `

      if (productData.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      // Transform snake_case to camelCase for frontend consistency
      const product = productData[0]
      return NextResponse.json({
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
        isActive: product.is_active,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      })
    } else if (category) {
      // Get products by category
      productData = await sql`
        SELECT * FROM products 
        WHERE category = ${category}
        AND is_active = true
      `
    } else {
      // Get all active products
      productData = await sql`
        SELECT * FROM products 
        WHERE is_active = true
      `
    }

    // Add debugging
    console.log(`Found ${productData.length} products`)

    // Transform snake_case to camelCase for frontend consistency
    const transformedProducts = productData.map((product) => ({
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
      isActive: product.is_active,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }))

    // Return empty array instead of undefined if no products found
    return NextResponse.json(transformedProducts || [])
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize the Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price, and category are required" },
        { status: 400 },
      )
    }

    // Insert the new product using snake_case column names
    const newProduct = await sql`
      INSERT INTO products 
      (name, description, price, sale_price, image_url, category, tags, nutritional_info, stock, is_active)
      VALUES 
      (${data.name}, ${data.description}, ${data.price}, ${data.salePrice || null}, 
       ${data.imageUrl || null}, ${data.category}, ${data.tags || null}, 
       ${data.nutritionalInfo ? JSON.stringify(data.nutritionalInfo) : null}::jsonb, 
       ${data.stock || 0}, ${data.isActive !== undefined ? data.isActive : true})
      RETURNING *
    `

    // Transform snake_case to camelCase for frontend consistency
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
        isActive: product.is_active,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
