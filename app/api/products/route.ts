import { type NextRequest, NextResponse } from "next/server"
import { db, products } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const id = searchParams.get("id")

    let productData

    if (id) {
      // Get a specific product by ID
      productData = await db
        .select()
        .from(products)
        .where(eq(products.id, Number.parseInt(id)))
        .limit(1)

      if (productData.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      return NextResponse.json(productData[0])
    } else if (category) {
      // Get products by category
      productData = await db
        .select()
        .from(products)
        .where(eq(products.category, category))
        .where(eq(products.isActive, true))
    } else {
      // Get all active products
      productData = await db.select().from(products).where(eq(products.isActive, true))
    }

    return NextResponse.json(productData)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price, and category are required" },
        { status: 400 },
      )
    }

    // Insert the new product
    const newProduct = await db
      .insert(products)
      .values({
        name: data.name,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice || null,
        imageUrl: data.imageUrl || null,
        category: data.category,
        tags: data.tags || null,
        nutritionalInfo: data.nutritionalInfo || null,
        stock: data.stock || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      })
      .returning()

    return NextResponse.json(newProduct[0], { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
