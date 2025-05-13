import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Helper function to get user ID from session with better error handling
async function getUserId() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    console.log("Session:", JSON.stringify(session, null, 2))
    throw new Error("User not authenticated")
  }

  return Number.parseInt(session.user.id as string)
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    const sql = neon(process.env.DATABASE_URL!)

    console.log("Fetching cart for user:", userId)

    // First, check if the cart_items table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const cartTableExists = tables.some((t) => t.table_name === "cart_items")

    if (!cartTableExists) {
      console.log("Cart table doesn't exist, creating it...")
      await sql`
        CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `
    }

    // Get all cart items for the user
    const cartItems = await sql`
      SELECT ci.*, p.name, p.price, p.imageurl, p.category
      FROM cart_items ci
      LEFT JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ${userId}
    `

    console.log("Cart items fetched:", cartItems.length)

    // Transform the data to match the expected format
    const transformedItems = cartItems.map((item) => ({
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      product: {
        name: item.name,
        price: item.price,
        salePrice: item.saleprice,
        imageUrl: item.imageurl,
        category: item.category,
      },
    }))

    // Calculate subtotal
    const subtotal = transformedItems.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price
      return sum + price * item.quantity
    }, 0)

    return NextResponse.json({
      items: transformedItems,
      subtotal,
      itemCount: transformedItems.length,
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    if (error instanceof Error && error.message === "User not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      {
        error: "Failed to fetch cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    const data = await request.json()
    const sql = neon(process.env.DATABASE_URL!)

    console.log("Adding to cart:", data)

    // Validate required fields
    if (!data.productId || !data.quantity) {
      return NextResponse.json(
        { error: "Missing required fields: productId and quantity are required" },
        { status: 400 },
      )
    }

    // First, check if the cart_items table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const cartTableExists = tables.some((t) => t.table_name === "cart_items")

    if (!cartTableExists) {
      console.log("Cart table doesn't exist, creating it...")
      await sql`
        CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `
    }

    // Check if product exists
    const productExists = await sql`
      SELECT id FROM products 
      WHERE id = ${data.productId}
      LIMIT 1
    `

    if (productExists.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT id FROM cart_items
      WHERE user_id = ${userId} AND product_id = ${data.productId}
      LIMIT 1
    `

    let result

    if (existingItem.length > 0) {
      // Update quantity if item already exists
      result = await sql`
        UPDATE cart_items
        SET quantity = ${data.quantity}, updated_at = NOW()
        WHERE id = ${existingItem[0].id}
        RETURNING id, product_id, quantity
      `
    } else {
      // Add new item to cart
      result = await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${userId}, ${data.productId}, ${data.quantity})
        RETURNING id, product_id, quantity
      `
    }

    // Get product details for the response
    const product = await sql`
      SELECT name, price, saleprice, imageurl, category
      FROM products 
      WHERE id = ${data.productId}
      LIMIT 1
    `

    const response = {
      id: result[0].id,
      productId: result[0].product_id,
      quantity: result[0].quantity,
      product: {
        name: product[0].name,
        price: product[0].price,
        salePrice: product[0].saleprice,
        imageUrl: product[0].imageurl,
        category: product[0].category,
      },
      message: existingItem.length > 0 ? "Cart updated" : "Item added to cart",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error updating cart:", error)
    if (error instanceof Error && error.message === "User not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      {
        error: "Failed to update cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
