import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user ID
    const userId = session.user.id

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const productId = Number.parseInt(body.productId)
    const quantity = body.quantity || 1

    if (isNaN(productId) || productId <= 0) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    if (quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 })
    }

    // Initialize Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Check if cart_items table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'cart_items'
      ) as exists
    `

    if (!tableCheck[0].exists) {
      // Create cart_items table if it doesn't exist
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

    // Check if product exists and is in stock
    const productCheck = await sql`
      SELECT id, stock FROM products WHERE id = ${productId} AND isactive = true
    `

    if (productCheck.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (productCheck[0].stock < quantity) {
      return NextResponse.json(
        { error: "Not enough stock available", availableStock: productCheck[0].stock },
        { status: 400 },
      )
    }

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT id, quantity FROM cart_items WHERE user_id = ${userId} AND product_id = ${productId}
    `

    let result

    if (existingItem.length > 0) {
      // Update existing item
      const newQuantity = existingItem[0].quantity + quantity

      // Check if new quantity exceeds stock
      if (newQuantity > productCheck[0].stock) {
        return NextResponse.json(
          {
            error: "Adding this quantity would exceed available stock",
            currentQuantity: existingItem[0].quantity,
            availableStock: productCheck[0].stock,
          },
          { status: 400 },
        )
      }

      result = await sql`
        UPDATE cart_items
        SET quantity = ${newQuantity}, updated_at = NOW()
        WHERE id = ${existingItem[0].id}
        RETURNING id, quantity
      `
    } else {
      // Add new item
      result = await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${userId}, ${productId}, ${quantity})
        RETURNING id, quantity
      `
    }

    // Get updated cart count
    const cartCount = await sql`
      SELECT COUNT(*) as count FROM cart_items WHERE user_id = ${userId}
    `

    return NextResponse.json(
      {
        success: true,
        cartItem: result[0],
        cartCount: cartCount[0].count,
        message: "Item added to cart successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error adding item to cart:", error)
    return NextResponse.json(
      {
        error: "Failed to add item to cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
