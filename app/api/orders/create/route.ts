import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()

    console.log("=== ORDER CREATION START ===")
    console.log("Received order data:", JSON.stringify(body, null, 2))

    // Validate required fields
    if (!body.customer || !body.shipping || !body.order) {
      console.log("Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check what tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('orders', 'order_items', 'users')
    `
    console.log("Available tables:", tables)

    const hasOrders = tables.some((t) => t.table_name === "orders")
    const hasOrderItems = tables.some((t) => t.table_name === "order_items")
    const hasUsers = tables.some((t) => t.table_name === "users")

    if (!hasOrders) {
      console.log("Orders table does not exist")
      return NextResponse.json({ error: "Orders table not found" }, { status: 500 })
    }

    // Check orders table structure
    const ordersColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      AND table_schema = 'public'
    `
    console.log("Orders table columns:", ordersColumns)

    let userId = null

    // Try to get or create user if users table exists
    if (hasUsers) {
      try {
        const existingUser = await sql`
          SELECT id FROM users WHERE email = ${body.customer.email}
        `

        if (existingUser.length > 0) {
          userId = existingUser[0].id
          console.log("Found existing user:", userId)
        } else {
          // Create a simple user record
          const newUser = await sql`
            INSERT INTO users (name, email, role) 
            VALUES (
              ${`${body.customer.firstName} ${body.customer.lastName}`}, 
              ${body.customer.email}, 
              'user'
            )
            RETURNING id
          `
          userId = newUser[0].id
          console.log("Created new user:", userId)
        }
      } catch (userError) {
        console.log("User creation failed, continuing without user:", userError)
        userId = null
      }
    }

    // Get cart items
    const cartId = request.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("cartId="))
      ?.split("=")[1]

    console.log("Cart ID from cookie:", cartId)

    let cartItems = []
    let cartSubtotal = 0

    if (cartId) {
      try {
        const items = await sql`
          SELECT 
            c.product_id,
            c.quantity,
            p.name,
            p.price,
            p.saleprice
          FROM cart c
          JOIN products p ON c.product_id = p.id
          WHERE c.id = ${cartId}
        `

        console.log("Raw cart items from DB:", items)

        cartItems = items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          name: item.name,
          price: (item.saleprice || item.price) / 100, // Convert from cents
        }))

        cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        console.log("Processed cart items:", cartItems)
        console.log("Cart subtotal:", cartSubtotal)
      } catch (cartError) {
        console.log("Error fetching cart items:", cartError)
      }
    }

    if (cartItems.length === 0) {
      console.log("No cart items found")
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // Calculate totals
    const shippingCost = body.order.shipping || 0
    const totalAmount = cartSubtotal + shippingCost

    console.log("Final totals:", { cartSubtotal, shippingCost, totalAmount })

    // Create order with minimal required fields
    let orderResult
    try {
      // Try with user_id first
      if (userId) {
        orderResult = await sql`
          INSERT INTO orders (
            user_id, 
            status, 
            total_amount,
            created_at
          ) 
          VALUES (
            ${userId}, 
            'pending', 
            ${Math.round(totalAmount * 100)},
            CURRENT_TIMESTAMP
          )
          RETURNING id
        `
      } else {
        // Try without user_id if it's nullable
        orderResult = await sql`
          INSERT INTO orders (
            status, 
            total_amount,
            created_at
          ) 
          VALUES (
            'pending', 
            ${Math.round(totalAmount * 100)},
            CURRENT_TIMESTAMP
          )
          RETURNING id
        `
      }
    } catch (orderError) {
      console.log("Order creation failed:", orderError)

      // Try with even more minimal fields
      try {
        orderResult = await sql`
          INSERT INTO orders (total_amount) 
          VALUES (${Math.round(totalAmount * 100)})
          RETURNING id
        `
      } catch (minimalError) {
        console.log("Minimal order creation also failed:", minimalError)
        return NextResponse.json(
          {
            error: "Failed to create order",
            details: minimalError instanceof Error ? minimalError.message : String(minimalError),
          },
          { status: 500 },
        )
      }
    }

    const orderId = orderResult[0].id
    console.log("Created order with ID:", orderId)

    // Add order items if table exists
    if (hasOrderItems && cartItems.length > 0) {
      try {
        for (const item of cartItems) {
          await sql`
            INSERT INTO order_items (
              order_id, 
              product_id, 
              quantity, 
              price
            ) 
            VALUES (
              ${orderId}, 
              ${item.productId}, 
              ${item.quantity}, 
              ${Math.round(item.price * 100)}
            )
          `
        }
        console.log("Added order items successfully")
      } catch (itemsError) {
        console.log("Failed to add order items:", itemsError)
        // Continue anyway, order is created
      }
    }

    // Clear the cart
    try {
      await sql`DELETE FROM cart WHERE id = ${cartId}`
      console.log("Cleared cart successfully")
    } catch (clearError) {
      console.log("Failed to clear cart:", clearError)
      // Continue anyway
    }

    console.log("=== ORDER CREATION SUCCESS ===")

    return NextResponse.json({
      success: true,
      orderId: orderId,
      userId: userId,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("=== ORDER CREATION ERROR ===")
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
