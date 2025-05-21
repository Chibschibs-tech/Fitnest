import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { neon } from "@neondatabase/serverless"

// Force dynamic rendering to avoid caching issues
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Get cart ID from cookies
    const cookieStore = cookies()
    const cartId = cookieStore.get("cartId")?.value

    if (!cartId) {
      return NextResponse.json({ items: [] })
    }

    // Query the database for cart items
    const cartItems = await sql`
      SELECT 
        c.id, 
        c.product_id, 
        c.quantity, 
        c.created_at,
        p.name, 
        p.price, 
        p.image_url
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.cart_id = ${cartId}
      ORDER BY c.created_at DESC
    `

    // Calculate totals
    let subtotal = 0
    const items = cartItems.map((item: any) => {
      const itemTotal = Number.parseFloat(item.price) * item.quantity
      subtotal += itemTotal
      return {
        id: item.id,
        productId: item.product_id,
        name: item.name,
        price: Number.parseFloat(item.price),
        imageUrl: item.image_url,
        quantity: item.quantity,
        total: itemTotal,
      }
    })

    // Apply tax and calculate final total
    const tax = subtotal * 0.05 // 5% tax
    const total = subtotal + tax

    return NextResponse.json({
      items,
      summary: {
        subtotal,
        tax,
        total,
        itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      },
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: "Failed to fetch cart", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

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

    // Use a try-catch block for the database connection
    let sql
    try {
      sql = neon(process.env.DATABASE_URL || "")
    } catch (dbConnError) {
      console.error("Database connection error:", dbConnError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbConnError instanceof Error ? dbConnError.message : String(dbConnError),
        },
        { status: 500 },
      )
    }

    // Check if cart table exists
    let tableExists
    try {
      tableExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'cart'
        ) as exists
      `
    } catch (tableCheckError) {
      console.error("Error checking if cart table exists:", tableCheckError)
      return NextResponse.json(
        {
          error: "Failed to check if cart table exists",
          details: tableCheckError instanceof Error ? tableCheckError.message : String(tableCheckError),
        },
        { status: 500 },
      )
    }

    // Create cart table if it doesn't exist
    if (!tableExists[0].exists) {
      try {
        await sql`
          CREATE TABLE cart (
            id VARCHAR(255) NOT NULL,
            user_id VARCHAR(255),
            product_id TEXT NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id, product_id)
          )
        `
      } catch (createTableError) {
        console.error("Error creating cart table:", createTableError)
        return NextResponse.json(
          {
            error: "Failed to create cart table",
            details: createTableError instanceof Error ? createTableError.message : String(createTableError),
          },
          { status: 500 },
        )
      }
    }

    // Check if product exists
    let product
    try {
      product = await sql`SELECT id FROM products WHERE id = ${productId}`
    } catch (productCheckError) {
      console.error("Error checking if product exists:", productCheckError)
      return NextResponse.json(
        {
          error: "Failed to check if product exists",
          details: productCheckError instanceof Error ? productCheckError.message : String(productCheckError),
        },
        { status: 500 },
      )
    }

    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart
    let existingItem
    try {
      existingItem = await sql`
        SELECT * FROM cart WHERE id = ${cartId} AND product_id = ${productId}
      `
    } catch (existingItemCheckError) {
      console.error("Error checking if item exists in cart:", existingItemCheckError)
      return NextResponse.json(
        {
          error: "Failed to check if item exists in cart",
          details:
            existingItemCheckError instanceof Error ? existingItemCheckError.message : String(existingItemCheckError),
        },
        { status: 500 },
      )
    }

    try {
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
    } catch (updateCartError) {
      console.error("Error updating cart:", updateCartError)
      return NextResponse.json(
        {
          error: "Failed to update cart",
          details: updateCartError instanceof Error ? updateCartError.message : String(updateCartError),
        },
        { status: 500 },
      )
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
