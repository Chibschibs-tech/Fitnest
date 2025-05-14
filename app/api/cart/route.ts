import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Helper function to ensure cart table exists
async function ensureCartTableExists() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if cart_items table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const cartTableExists = tables.some((t) => t.table_name === "cart_items")

    if (!cartTableExists) {
      console.log("Creating cart_items table...")
      await sql`
        CREATE TABLE cart_items (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("cart_items table created successfully")
    }
    return true
  } catch (error) {
    console.error("Error checking/creating cart table:", error)
    return false
  }
}

// Helper function to get user ID from session
async function getUserId() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }
  return Number.parseInt(session.user.id as string)
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    const sql = neon(process.env.DATABASE_URL!)

    // Ensure cart table exists
    await ensureCartTableExists()

    console.log("Fetching cart for user:", userId)

    // Get all cart items for the user with product details
    const cartItems = await sql`
      SELECT 
        ci.id, 
        ci.product_id as "productId", 
        ci.quantity,
        p.name,
        p.description,
        p.price,
        p.saleprice as "salePrice",
        p.imageurl as "imageUrl",
        p.category
      FROM cart_items ci
      LEFT JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ${userId}
    `

    console.log("Cart items fetched:", cartItems.length)

    // Calculate totals
    const subtotal = cartItems.reduce((sum: number, item: any) => {
      const price = item.salePrice || item.price
      return sum + price * item.quantity
    }, 0)

    return NextResponse.json({
      items: cartItems,
      subtotal,
      itemCount: cartItems.length,
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

    // Ensure cart table exists
    await ensureCartTableExists()

    // Validate required fields
    if (!data.productId || data.quantity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: productId and quantity are required" },
        { status: 400 },
      )
    }

    // Check if product exists and is active
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
      SELECT id, quantity FROM cart_items
      WHERE user_id = ${userId} AND product_id = ${data.productId}
      LIMIT 1
    `

    let result

    if (existingItem.length > 0) {
      // Update quantity if item already exists
      const newQuantity = existingItem[0].quantity + data.quantity
      result = await sql`
        UPDATE cart_items
        SET quantity = ${newQuantity}, updated_at = NOW()
        WHERE id = ${existingItem[0].id}
        RETURNING id, product_id as "productId", quantity
      `
    } else {
      // Add new item to cart
      result = await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${userId}, ${data.productId}, ${data.quantity})
        RETURNING id, product_id as "productId", quantity
      `
    }

    // Get product details for the response
    const product = await sql`
      SELECT 
        name, 
        price, 
        saleprice as "salePrice", 
        imageurl as "imageUrl"
      FROM products 
      WHERE id = ${data.productId}
      LIMIT 1
    `

    const response = {
      ...result[0],
      product: product[0],
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

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId()
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("id")
    const clearAll = searchParams.get("clearAll")
    const sql = neon(process.env.DATABASE_URL!)

    // Ensure cart table exists
    await ensureCartTableExists()

    console.log("Delete cart request:", { itemId, clearAll })

    if (clearAll === "true") {
      // Clear entire cart
      await sql`DELETE FROM cart_items WHERE user_id = ${userId}`
      return NextResponse.json({ message: "Cart cleared successfully" })
    } else if (itemId) {
      // Delete specific item
      const result = await sql`
        DELETE FROM cart_items
        WHERE id = ${Number.parseInt(itemId)} AND user_id = ${userId}
        RETURNING id
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
      }

      return NextResponse.json({ message: "Item removed from cart" })
    } else {
      return NextResponse.json({ error: "Missing item ID or clearAll parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error removing from cart:", error)
    if (error instanceof Error && error.message === "User not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      {
        error: "Failed to remove from cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Add PUT method to update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId()
    const data = await request.json()
    const sql = neon(process.env.DATABASE_URL!)

    // Ensure cart table exists
    await ensureCartTableExists()

    console.log("Updating cart item:", data)

    // Validate required fields
    if (!data.itemId || data.quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields: itemId and quantity are required" }, { status: 400 })
    }

    // Update the item quantity
    const result = await sql`
      UPDATE cart_items
      SET quantity = ${data.quantity}, updated_at = NOW()
      WHERE id = ${data.itemId} AND user_id = ${userId}
      RETURNING id, product_id as "productId", quantity
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    return NextResponse.json({
      ...result[0],
      message: "Cart item updated",
    })
  } catch (error) {
    console.error("Error updating cart item:", error)
    if (error instanceof Error && error.message === "User not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      {
        error: "Failed to update cart item",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
