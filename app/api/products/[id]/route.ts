import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Force dynamic to prevent caching issues
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const id = params.id

    // Fix column names to match database schema
    const product = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        sale_price as "salePrice", 
        image_url as "imageUrl", 
        category,
        tags,
        nutritional_info as "nutritionalInfo",
        stock
      FROM products
      WHERE id = ${id} AND isactive = true
    `

    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product[0])
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const id = params.id
    const data = await request.json()

    // Check if product exists
    const existingProduct = await sql`SELECT id FROM products WHERE id = ${id}`
    if (existingProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Update product - Fix column names to match database schema
    const updatedProduct = await sql`
      UPDATE products
      SET 
        name = ${data.name || null},
        description = ${data.description || null},
        price = ${data.price || null},
        sale_price = ${data.salePrice || null},
        image_url = ${data.imageUrl || null},
        category = ${data.category || null},
        tags = ${data.tags || null},
        nutritional_info = ${data.nutritionalInfo ? JSON.stringify(data.nutritionalInfo) : null}::jsonb,
        stock = ${data.stock !== undefined ? data.stock : null},
        isactive = ${data.isActive !== undefined ? data.isActive : null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    // Transform column names for frontend consistency
    const product = updatedProduct[0]
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
      isActive: product.isactive,
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const id = params.id

    // Check if product exists
    const existingProduct = await sql`SELECT id FROM products WHERE id = ${id}`
    if (existingProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete product
    await sql`DELETE FROM products WHERE id = ${id}`

    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
