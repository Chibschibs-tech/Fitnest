import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { decrypt } from "@/lib/jwt"

// Helper function to get user ID from either NextAuth or custom JWT
async function getUserId() {
  const cookieStore = cookies()
  const nextAuthToken = cookieStore.get("next-auth.session-token")?.value
  const jwtToken = cookieStore.get("session")?.value

  const sql = neon(process.env.DATABASE_URL!)

  // Try NextAuth first
  if (nextAuthToken) {
    // Check if the sessions table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const hasSessionsTable = tables.some((t) => t.table_name === "sessions")

    if (hasSessionsTable) {
      // Try to get the user from the sessions table
      const sessions = await sql`
        SELECT * FROM sessions WHERE session_token = ${nextAuthToken} LIMIT 1
      `

      if (sessions.length > 0) {
        const session = sessions[0]
        return session.user_id
      }
    }
  }

  // If NextAuth didn't work, try custom JWT
  if (jwtToken) {
    try {
      // Decrypt the JWT token
      const payload = await decrypt(jwtToken)

      if (payload && payload.id) {
        // Verify the user exists in the database
        const users = await sql`
          SELECT * FROM users WHERE id = ${payload.id} LIMIT 1
        `

        if (users.length > 0) {
          return users[0].id
        }
      }
    } catch (jwtError) {
      console.error("JWT decryption error:", jwtError)
    }
  }

  throw new Error("User not authenticated")
}

// Helper function to get column names
async function getTableColumns(tableName) {
  const sql = neon(process.env.DATABASE_URL!)

  const columns = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = ${tableName}
  `

  return columns.map((col) => col.column_name)
}

export async function GET() {
  try {
    let userId

    try {
      userId = await getUserId()
    } catch (error) {
      console.error("Error getting user ID:", error)
      return NextResponse.json({
        items: [],
        subtotal: 0,
        itemCount: 0,
        error: "Not authenticated",
      })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // First, check if the cart_items table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const cartTableExists = tables.some((t) => t.table_name === "cart_items")

    if (!cartTableExists) {
      // Create the cart_items table
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
    }

    // Get product table columns to determine correct column names
    const productColumns = await getTableColumns("products")
    console.log("Product table columns:", productColumns)

    // Determine the correct column names
    const hasSalePrice = productColumns.includes("sale_price")
    const hasSaleprice = productColumns.includes("saleprice")
    const hasImageUrl = productColumns.includes("image_url")
    const hasImageurl = productColumns.includes("imageurl")

    // Build the SQL query dynamically based on the column names
    const salePriceColumn = hasSalePrice ? "sale_price" : hasSaleprice ? "saleprice" : null
    const imageUrlColumn = hasImageUrl ? "image_url" : hasImageurl ? "imageurl" : null

    // Get all cart items for the user with product details
    let cartItems

    if (salePriceColumn && imageUrlColumn) {
      cartItems = await sql`
        SELECT 
          ci.id, 
          ci.product_id as "productId", 
          ci.quantity,
          p.name,
          p.description,
          p.price,
          p.${sql(salePriceColumn)} as "salePrice",
          p.${sql(imageUrlColumn)} as "imageUrl",
          p.category
        FROM cart_items ci
        LEFT JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ${userId}
      `
    } else {
      // Fallback query without problematic columns
      cartItems = await sql`
        SELECT 
          ci.id, 
          ci.product_id as "productId", 
          ci.quantity,
          p.name,
          p.description,
          p.price,
          p.category
        FROM cart_items ci
        LEFT JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ${userId}
      `
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.salePrice || item.price
      return sum + price * item.quantity
    }, 0)

    return NextResponse.json({
      items: cartItems,
      subtotal,
      itemCount: cartItems.length,
    })
  } catch (error) {
    console.error("Error fetching cart directly:", error)
    return NextResponse.json({
      items: [],
      subtotal: 0,
      itemCount: 0,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    let userId

    try {
      userId = await getUserId()
    } catch (error) {
      console.error("Error getting user ID:", error)
      return NextResponse.json(
        {
          error: "Not authenticated",
        },
        { status: 401 },
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Validate required fields
    if (!data.productId || !data.quantity) {
      return NextResponse.json(
        { error: "Missing required fields: productId and quantity are required" },
        { status: 400 },
      )
    }

    // Check if product exists
    const productExists = await sql`
      SELECT id FROM products 
      WHERE id = ${data.productId}
      LIMIT 1
    `

    if (productExists.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT id FROM cart_items
      WHERE user_id = ${userId} AND product_id = ${data.productId}
      LIMIT 1
    `

    let result

    if (existingItem.length > 0) {
      // Update quantity if item already exists
      result = await sql`
        UPDATE cart_items
        SET quantity = ${data.quantity}, updated_at = NOW()
        WHERE id = ${existingItem[0].id}
        RETURNING id, product_id as "productId", quantity
      `
    } else {
      // Add new item to cart
      result = await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${userId}, ${data.productId}, ${data.quantity})
        RETURNING id, product_id as "productId", quantity
      `
    }

    // Get product table columns to determine correct column names
    const productColumns = await getTableColumns("products")

    // Determine the correct column names
    const hasSalePrice = productColumns.includes("sale_price")
    const hasSaleprice = productColumns.includes("saleprice")
    const hasImageUrl = productColumns.includes("image_url")
    const hasImageurl = productColumns.includes("imageurl")

    // Build the SQL query dynamically based on the column names
    const salePriceColumn = hasSalePrice ? "sale_price" : hasSaleprice ? "saleprice" : null
    const imageUrlColumn = hasImageUrl ? "image_url" : hasImageurl ? "imageurl" : null

    // Get product details for the response
    let product

    if (salePriceColumn && imageUrlColumn) {
      product = await sql`
        SELECT 
          name, 
          price, 
          ${sql(salePriceColumn)} as "salePrice", 
          ${sql(imageUrlColumn)} as "imageUrl"
        FROM products 
        WHERE id = ${data.productId}
        LIMIT 1
      `
    } else {
      // Fallback query without problematic columns
      product = await sql`
        SELECT 
          name, 
          price
        FROM products 
        WHERE id = ${data.productId}
        LIMIT 1
      `
    }

    const response = {
      ...result[0],
      product: product[0],
      message: existingItem.length > 0 ? "Cart updated" : "Item added to cart",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error updating cart directly:", error)
    return NextResponse.json(
      {
        error: "Failed to update cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
