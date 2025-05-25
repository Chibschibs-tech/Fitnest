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

    // Check products table structure first
    const productColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products'
    `
    console.log("Product table columns:", productColumns)

    // Check all cart data
    const allCartData = await sql`SELECT * FROM cart LIMIT 10`
    console.log("All cart data (first 10 rows):", allCartData)

    const allCartItemsData = await sql`SELECT * FROM cart_items LIMIT 10`
    console.log("All cart_items data (first 10 rows):", allCartItemsData)

    // Check products table with actual columns
    const allProducts = await sql`SELECT * FROM products LIMIT 3`
    console.log("Sample products:", allProducts)

    let cartSpecificData = []
    let cartItemsSpecificData = []

    if (cartId) {
      // Try to find data with this specific cart ID
      cartSpecificData = await sql`SELECT * FROM cart WHERE id = ${cartId}`
      console.log("Cart data for specific ID:", cartSpecificData)

      cartItemsSpecificData = await sql`SELECT * FROM cart_items WHERE cart_id = ${cartId}`
      console.log("Cart items data for specific ID:", cartItemsSpecificData)

      // Try different cart_id formats
      const cartItemsAnyFormat = await sql`
        SELECT * FROM cart_items 
        WHERE cart_id = ${cartId} OR cart_id = ${cartId}::text OR cart_id::text = ${cartId}
      `
      console.log("Cart items any format:", cartItemsAnyFormat)
    }

    return NextResponse.json({
      cartId,
      productColumns,
      allCartCount: allCartData.length,
      allCartItemsCount: allCartItemsData.length,
      cartSpecificData,
      cartItemsSpecificData,
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
