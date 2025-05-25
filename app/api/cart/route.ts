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
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get cart items with product details - fix the column name issue
    const cartItems = await sql`
      SELECT c.*, p.name, p.price, p.imageurl as image
      FROM cart c
      JOIN products p ON c.product_id = p.id::integer
      WHERE c.id = ${cartId}
    `

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + Number.parseFloat(item.price) * item.quantity
    }, 0)

    // Format the response
    const items = cartItems.map((item) => ({
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      product: {
        id: item.product_id,
        name: item.name,
        price: Number.parseFloat(item.price),
        image: item.image,
      },
    }))

    return NextResponse.json(
      { items, subtotal, cartId },
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

    // Convert productId to integer for cart table
    const productIdInt = Number.parseInt(productId)
    if (isNaN(productIdInt)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    // Check if product exists
    const product = await sql`SELECT id FROM products WHERE id = ${productIdInt}`
    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT * FROM cart WHERE id = ${cartId} AND product_id = ${productIdInt}
    `

    if (existingItem.length > 0) {
      // Update quantity if item exists
      await sql`
        UPDATE cart 
        SET quantity = quantity + ${quantity} 
        WHERE id = ${cartId} AND product_id = ${productIdInt}
      `
    } else {
      // Add new item to cart
      await sql`
        INSERT INTO cart (id, product_id, quantity) 
        VALUES (${cartId}, ${productIdInt}, ${quantity})
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

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const cartId = cookieStore.get("cartId")?.value

    if (!cartId) {
      return NextResponse.json({ error: "No cart found" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Convert productId to integer
    const productIdInt = Number.parseInt(productId)
    if (isNaN(productIdInt)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await sql`
        DELETE FROM cart 
        WHERE id = ${cartId} AND product_id = ${productIdInt}
      `
    } else {
      // Update quantity
      await sql`
        UPDATE cart 
        SET quantity = ${quantity}
        WHERE id = ${cartId} AND product_id = ${productIdInt}
      `
    }

    return NextResponse.json({ success: true, message: "Cart updated" })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json(
      { error: "Failed to update cart", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const productId = url.searchParams.get("id")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const cartId = cookieStore.get("cartId")?.value

    if (!cartId) {
      return NextResponse.json({ error: "No cart found" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Convert productId to integer
    const productIdInt = Number.parseInt(productId)
    if (isNaN(productIdInt)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    await sql`
      DELETE FROM cart 
      WHERE id = ${cartId} AND product_id = ${productIdInt}
    `

    return NextResponse.json({ success: true, message: "Item removed from cart" })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json(
      { error: "Failed to remove item", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
