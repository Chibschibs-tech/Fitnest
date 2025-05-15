import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

// Log that this file is loaded
console.log("Cart API route file loaded")

export async function POST(request: Request) {
  console.log("POST request received at /api/cart")

  try {
    // Get user session
    const session = await getServerSession(authOptions)
    console.log("Session:", session ? "exists" : "null")

    // Check if user is authenticated
    if (!session || !session.user) {
      console.log("User not authenticated")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user ID
    const userId = session.user.id
    console.log("User ID:", userId)

    if (!userId) {
      console.log("User ID not found in session")
      return NextResponse.json({ error: "User ID not found" }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()
    const { productId, quantity } = body
    console.log("Request body:", { productId, quantity })

    // Validate input
    if (!productId || !quantity || quantity < 1) {
      console.log("Invalid product ID or quantity")
      return NextResponse.json({ error: "Invalid product ID or quantity" }, { status: 400 })
    }

    // Initialize Neon SQL client
    console.log("Initializing SQL client")
    const sql = neon(process.env.DATABASE_URL!)

    // Ensure cart table exists
    console.log("Ensuring cart_items table exists")
    await sql`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if product exists
    console.log("Checking if product exists")
    const product = await sql`SELECT id FROM products WHERE id = ${productId}`
    console.log("Product check result:", product)

    if (product.length === 0) {
      console.log("Product not found")
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart
    console.log("Checking if item exists in cart")
    const existingItem = await sql`
      SELECT id, quantity FROM cart_items 
      WHERE user_id = ${userId} AND product_id = ${productId}
    `
    console.log("Existing item check result:", existingItem)

    if (existingItem.length > 0) {
      // Update existing cart item
      const newQuantity = existingItem[0].quantity + quantity
      console.log("Updating existing cart item to quantity:", newQuantity)

      await sql`
        UPDATE cart_items 
        SET quantity = ${newQuantity}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existingItem[0].id}
      `

      return NextResponse.json({
        success: true,
        message: "Cart updated successfully",
        quantity: newQuantity,
      })
    } else {
      // Add new item to cart
      console.log("Adding new item to cart")
      await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${userId}, ${productId}, ${quantity})
      `

      return NextResponse.json({
        success: true,
        message: "Item added to cart successfully",
        quantity,
      })
    }
  } catch (error) {
    console.error("Error in cart API:", error)
    return NextResponse.json(
      {
        error: "Failed to add item to cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  console.log("GET request received at /api/cart")
  return NextResponse.json({ message: "Cart API is working" })
}
