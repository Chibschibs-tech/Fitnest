import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Force dynamic rendering to avoid caching issues
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get("cartId")?.value

    console.log("GET /api/cart - Cart ID from cookie:", cartId)

    if (!cartId) {
      console.log("GET /api/cart - No cart ID found, returning empty cart")
      return NextResponse.json({
        items: [],
        subtotal: 0,
        cartId: null,
      })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // First, let's check what tables exist and their structure
    try {
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('cart', 'cart_items', 'products')
      `
      console.log("Available tables:", tables)

      // Check if we have cart_items table (preferred) or cart table
      const hasCartItems = tables.some((t) => t.table_name === "cart_items")
      const hasCart = tables.some((t) => t.table_name === "cart")
      const hasProducts = tables.some((t) => t.table_name === "products")

      if (!hasProducts) {
        console.log("Products table not found")
        return NextResponse.json({
          items: [],
          subtotal: 0,
          cartId,
        })
      }

      let cartItems = []

      if (hasCartItems) {
        // Use cart_items table
        console.log("Using cart_items table")
        cartItems = await sql`
          SELECT 
            ci.id,
            ci.product_id,
            ci.quantity,
            p.name,
            p.price,
            p.saleprice,
            p.imageurl
          FROM cart_items ci
          JOIN products p ON ci.product_id = p.id
          WHERE ci.cart_id = ${cartId}
          ORDER BY ci.created_at DESC
        `
      } else if (hasCart) {
        // Use cart table
        console.log("Using cart table")
        cartItems = await sql`
          SELECT 
            c.id,
            c.product_id,
            c.quantity,
            p.name,
            p.price,
            p.saleprice,
            p.imageurl
          FROM cart c
          JOIN products p ON c.product_id = p.id
          WHERE c.id = ${cartId}
          ORDER BY c.created_at DESC
        `
      } else {
        console.log("No cart table found")
        return NextResponse.json({
          items: [],
          subtotal: 0,
          cartId,
        })
      }

      console.log("GET /api/cart - Raw cart items:", cartItems)

      // Format the response
      const items = cartItems.map((item) => ({
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        name: item.name,
        price: Number(item.price) / 100, // Convert from cents to MAD
        salePrice: item.saleprice ? Number(item.saleprice) / 100 : null,
        imageUrl: item.imageurl,
      }))

      // Calculate subtotal
      const subtotal = items.reduce((sum, item) => {
        const price = item.salePrice || item.price
        return sum + price * item.quantity
      }, 0)

      console.log("GET /api/cart - Formatted items:", items)
      console.log("GET /api/cart - Subtotal:", subtotal)

      return NextResponse.json({
        items,
        subtotal,
        cartId,
      })
    } catch (dbError) {
      console.error("Database error in cart GET:", dbError)
      return NextResponse.json({
        items: [],
        subtotal: 0,
        cartId,
      })
    }
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

    console.log("POST /api/cart - Adding product:", productId, "quantity:", quantity)

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    let cartId = cookieStore.get("cartId")?.value

    // Create a new cart ID if one doesn't exist
    if (!cartId) {
      cartId = uuidv4()
      console.log("POST /api/cart - No cart ID found, generating new one:", cartId)
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Convert productId to string (our products table uses text IDs)
    const productIdStr = String(productId)

    // Check if product exists
    const product = await sql`SELECT id FROM products WHERE id = ${productIdStr}`
    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check what cart table we have
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('cart', 'cart_items')
    `

    const hasCartItems = tables.some((t) => t.table_name === "cart_items")

    if (hasCartItems) {
      // Use cart_items table
      const existingItem = await sql`
        SELECT id, quantity FROM cart_items
        WHERE cart_id = ${cartId} AND product_id = ${productIdStr}
      `

      if (existingItem.length > 0) {
        // Update quantity if item exists
        const newQuantity = existingItem[0].quantity + quantity
        await sql`
          UPDATE cart_items
          SET quantity = ${newQuantity}
          WHERE cart_id = ${cartId} AND product_id = ${productIdStr}
        `
      } else {
        // Add new item to cart
        await sql`
          INSERT INTO cart_items (cart_id, product_id, quantity, created_at)
          VALUES (${cartId}, ${productIdStr}, ${quantity}, CURRENT_TIMESTAMP)
        `
      }
    } else {
      // Use cart table (fallback)
      const existingItem = await sql`
        SELECT id, quantity FROM cart
        WHERE id = ${cartId} AND product_id = ${productIdStr}
      `

      if (existingItem.length > 0) {
        const newQuantity = existingItem[0].quantity + quantity
        await sql`
          UPDATE cart
          SET quantity = ${newQuantity}
          WHERE id = ${cartId} AND product_id = ${productIdStr}
        `
      } else {
        await sql`
          INSERT INTO cart (id, product_id, quantity, created_at)
          VALUES (${cartId}, ${productIdStr}, ${quantity}, CURRENT_TIMESTAMP)
        `
      }
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

    console.log("PUT /api/cart - Updating product:", productId, "quantity:", quantity)

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const cartId = cookieStore.get("cartId")?.value

    if (!cartId) {
      return NextResponse.json({ error: "No cart found" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const productIdStr = String(productId)

    // Check what cart table we have
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('cart', 'cart_items')
    `

    const hasCartItems = tables.some((t) => t.table_name === "cart_items")

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      if (hasCartItems) {
        await sql`
          DELETE FROM cart_items 
          WHERE cart_id = ${cartId} AND product_id = ${productIdStr}
        `
      } else {
        await sql`
          DELETE FROM cart 
          WHERE id = ${cartId} AND product_id = ${productIdStr}
        `
      }
    } else {
      // Update quantity
      if (hasCartItems) {
        await sql`
          UPDATE cart_items 
          SET quantity = ${quantity}
          WHERE cart_id = ${cartId} AND product_id = ${productIdStr}
        `
      } else {
        await sql`
          UPDATE cart 
          SET quantity = ${quantity}
          WHERE id = ${cartId} AND product_id = ${productIdStr}
        `
      }
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

    console.log("DELETE /api/cart - Removing product:", productId)

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const cartId = cookieStore.get("cartId")?.value

    if (!cartId) {
      return NextResponse.json({ error: "No cart found" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const productIdStr = String(productId)

    // Check what cart table we have
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('cart', 'cart_items')
    `

    const hasCartItems = tables.some((t) => t.table_name === "cart_items")

    if (hasCartItems) {
      await sql`
        DELETE FROM cart_items 
        WHERE cart_id = ${cartId} AND product_id = ${productIdStr}
      `
    } else {
      await sql`
        DELETE FROM cart 
        WHERE id = ${cartId} AND product_id = ${productIdStr}
      `
    }

    return NextResponse.json({ success: true, message: "Item removed from cart" })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json(
      { error: "Failed to remove item", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
