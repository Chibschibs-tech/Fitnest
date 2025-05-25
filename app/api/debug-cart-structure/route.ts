import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    console.log("=== DEBUGGING CART STRUCTURE ===")

    // Get cart ID from cookie
    const cartId = request.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("cartId="))
      ?.split("=")[1]

    console.log("Cart ID from cookie:", cartId)

    // Check what tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%cart%'
    `
    console.log("Cart-related tables:", tables)

    // Check cart table structure
    const cartColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cart'
    `
    console.log("Cart table columns:", cartColumns)

    // Check cart_items table structure if it exists
    try {
      const cartItemsColumns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'cart_items'
      `
      console.log("Cart_items table columns:", cartItemsColumns)
    } catch (e) {
      console.log("No cart_items table found")
    }

    // Try to find cart data with different queries
    if (cartId) {
      // Try cart table
      try {
        const cartData = await sql`SELECT * FROM cart WHERE id = ${cartId}`
        console.log("Cart table data:", cartData)
      } catch (e) {
        console.log("Error querying cart table:", e)
      }

      // Try cart_items table
      try {
        const cartItemsData = await sql`SELECT * FROM cart_items WHERE cart_id = ${cartId}`
        console.log("Cart_items table data:", cartItemsData)
      } catch (e) {
        console.log("Error querying cart_items table:", e)
      }

      // Try different cart query patterns
      try {
        const allCartData = await sql`SELECT * FROM cart`
        console.log("All cart data:", allCartData)
      } catch (e) {
        console.log("Error querying all cart data:", e)
      }
    }

    return NextResponse.json({
      cartId,
      tables,
      cartColumns,
      message: "Check console for detailed cart structure info",
    })
  } catch (error) {
    console.error("Error debugging cart structure:", error)
    return NextResponse.json(
      { error: "Failed to debug cart structure", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
