import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get cart ID from cookie
    const cartId = request.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("cartId="))
      ?.split("=")[1]

    console.log("=== FULL CART DEBUG ===")
    console.log("Cart ID from cookie:", cartId)

    // Check all table structures
    const cartColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cart'
      ORDER BY ordinal_position
    `
    console.log("Cart table columns:", cartColumns)

    const cartItemsColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cart_items'
      ORDER BY ordinal_position
    `
    console.log("Cart_items table columns:", cartItemsColumns)

    const productColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `
    console.log("Product table columns:", productColumns)

    // Check all cart data
    const allCartData = await sql`SELECT * FROM cart LIMIT 5`
    console.log("All cart data:", allCartData)

    const allCartItemsData = await sql`SELECT * FROM cart_items LIMIT 5`
    console.log("All cart_items data:", allCartItemsData)

    const allProducts = await sql`SELECT * FROM products LIMIT 3`
    console.log("Sample products:", allProducts)

    let cartSpecificData = []
    if (cartId) {
      cartSpecificData = await sql`SELECT * FROM cart WHERE id = ${cartId}`
      console.log("Cart data for specific ID:", cartSpecificData)
    }

    return NextResponse.json({
      cartId,
      cartColumns,
      cartItemsColumns,
      productColumns,
      allCartData,
      allCartItemsData,
      cartSpecificData,
      sampleProducts: allProducts,
      message: "Check console for full debug info",
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({
      error: "Debug failed",
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
