import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Force dynamic rendering to avoid caching issues
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    let cartId = cookieStore.get("cartId")?.value

    // Create a new cart ID if one doesn't exist
    if (!cartId) {
      cartId = uuidv4()
      // This won't actually set the cookie since we're in a GET request
      // but we'll return the cart ID in the response
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if cart table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'cart'
      ) as exists
    `

    // Create cart table if it doesn't exist
    if (!tableExists[0].exists) {
      await sql`
        CREATE TABLE cart (
          id VARCHAR(255) NOT NULL,
          user_id VARCHAR(255),
          product_id INT NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id, product_id)
        )
      `
    }

    // Check if products table exists
    const productsTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists
    `

    if (!productsTableExists[0].exists) {
      return NextResponse.json(
        { items: [], cartId },
        {
          status: 200,
          headers: cartId
            ? { "Set-Cookie": `cartId=${cartId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000` }
            : undefined,
        },
      )
    }

    // Get cart items with product details
    const cartItems = await sql`
      SELECT c.*, p.name, p.price, p.image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.id = ${cartId}
    `

    // Format the response
    const items = cartItems.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      product: {
        id: item.product_id,
        name: item.name,
        price: Number.parseFloat(item.price),
        image: item.image,
      },
    }))

    return NextResponse.json(
      { items, cartId },
      {
        status: 200,
        headers:
          cartId && !cookieStore.get("cartId")
            ? { "Set-Cookie": `cartId=${cartId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000` }
            : undefined,
      },
    )
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    let cartId = cookieStore.get("cartId")?.value

    // Create a new cart ID if one doesn't exist
    if (!cartId) {
      cartId = uuidv4()
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if cart table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'cart'
      ) as exists
    `

    // Create cart table if it doesn't exist
    if (!tableExists[0].exists) {
      await sql`
        CREATE TABLE cart (
          id VARCHAR(255) NOT NULL,
          user_id VARCHAR(255),
          product_id INT NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id, product_id)
        )
      `
    }

    // Check if product exists
    const product = await sql`SELECT id FROM products WHERE id = ${productId}`
    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT * FROM cart WHERE id = ${cartId} AND product_id = ${productId}
    `

    if (existingItem.length > 0) {
      // Update quantity if item exists
      await sql`
        UPDATE cart 
        SET quantity = quantity + ${quantity} 
        WHERE id = ${cartId} AND product_id = ${productId}
      `
    } else {
      // Add new item to cart
      await sql`
        INSERT INTO cart (id, product_id, quantity) 
        VALUES (${cartId}, ${productId}, ${quantity})
      `
    }

    // Set or update the cartId cookie
    const response = NextResponse.json({ success: true, message: "Item added to cart" }, { status: 200 })

    response.cookies.set({
      name: "cartId",
      value: cartId,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { error: "Failed to add item to cart", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
