import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        {
          items: [],
          count: 0,
          subtotal: 0,
        },
        { status: 200 },
      )
    }

    // Get user ID
    const userId = session.user.id

    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID not found",
        },
        { status: 400 },
      )
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
      return NextResponse.json(
        {
          items: [],
          count: 0,
          subtotal: 0,
          message: "Cart table created",
        },
        { status: 200 },
      )
    }

    // Get cart items with product details
    const cartItems = await sql`
      SELECT 
        ci.id, 
        ci.product_id as "productId", 
        ci.quantity,
        p.id as "product.id",
        p.name as "product.name",
        p.description as "product.description",
        p.price as "product.price",
        p.saleprice as "product.salePrice",
        p.imageurl as "product.imageUrl",
        p.category as "product.category"
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ${userId}
    `

    // Format the cart items
    const formattedItems = cartItems.map((item) => {
      const { productId, quantity, ...rest } = item
      return {
        id: item.id,
        productId,
        quantity,
        product: {
          id: rest["product.id"],
          name: rest["product.name"],
          description: rest["product.description"],
          price: Number.parseInt(rest["product.price"]),
          salePrice: rest["product.salePrice"] ? Number.parseInt(rest["product.salePrice"]) : null,
          imageUrl: rest["product.imageUrl"],
          category: rest["product.category"],
        },
      }
    })

    // Calculate subtotal
    const subtotal = formattedItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price
      return total + price * item.quantity
    }, 0)

    return NextResponse.json(
      {
        items: formattedItems,
        count: formattedItems.length,
        subtotal,
      },
      { status: 200 },
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
