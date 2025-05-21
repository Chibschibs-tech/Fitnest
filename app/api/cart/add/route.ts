import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Validate quantity
    const parsedQuantity = Number.parseInt(quantity.toString(), 10)
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return NextResponse.json({ error: "Quantity must be a positive number" }, { status: 400 })
    }

    // Get or create cart ID
    const cookieStore = cookies()
    let cartId = cookieStore.get("cartId")?.value

    if (!cartId) {
      cartId = uuidv4()
      // Set cookie with appropriate options
      cookieStore.set("cartId", cartId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    }

    // Check if product exists
    const productCheck = await sql`SELECT id, price FROM products WHERE id = ${productId}`
    if (productCheck.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT id, quantity FROM cart_items 
      WHERE cart_id = ${cartId} AND product_id = ${productId}
    `

    let result
    if (existingItem.length > 0) {
      // Update existing item
      const newQuantity = existingItem[0].quantity + parsedQuantity
      result = await sql`
        UPDATE cart_items 
        SET quantity = ${newQuantity}, updated_at = NOW() 
        WHERE id = ${existingItem[0].id} 
        RETURNING id, product_id, quantity
      `
    } else {
      // Add new item
      result = await sql`
        INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) 
        VALUES (${cartId}, ${productId}, ${parsedQuantity}, NOW(), NOW()) 
        RETURNING id, product_id, quantity
      `
    }

    // Get updated cart count
    const cartCount = await sql`
      SELECT SUM(quantity) as count FROM cart_items WHERE cart_id = ${cartId}
    `

    return NextResponse.json({
      success: true,
      item: result[0],
      cartCount: Number.parseInt(cartCount[0]?.count || "0", 10),
    })
  } catch (error) {
    console.error("Error adding item to cart:", error)
    return NextResponse.json(
      { error: "Failed to add item to cart", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
