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

    // Get or create user (user_id is required)
    let userId = null
    try {
      const existingUser = await sql`
        SELECT id FROM users WHERE email = ${body.customer.email}
      `

      if (existingUser.length > 0) {
        userId = existingUser[0].id
        console.log("Found existing user:", userId)
      } else {
        // Create a new user - need to handle password requirement
        const tempPassword = Math.random().toString(36).slice(-8)

        try {
          const newUser = await sql`
            INSERT INTO users (name, email, password, role) 
            VALUES (
              ${`${body.customer.firstName} ${body.customer.lastName}`}, 
              ${body.customer.email}, 
              ${tempPassword},
              'user'
            )
            RETURNING id
          `
          userId = newUser[0].id
          console.log("Created new user:", userId)
        } catch (userCreateError) {
          // Try without password if it's not required
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
          console.log("Created new user without password:", userId)
        }
      }
    } catch (userError) {
      console.log("User handling failed:", userError)
      return NextResponse.json({ error: "Failed to handle user account" }, { status: 500 })
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

    // Prepare required fields for orders table
    const deliveryAddress = `${body.shipping.address}, ${body.shipping.city}, ${body.shipping.postalCode}`
    const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    const now = new Date()

    // For plan_id, we'll use 1 as default (express shop order)
    // You might want to create different plan types later
    const planId = 1

    console.log("Order details:", {
      userId,
      planId,
      totalAmount: Math.round(totalAmount * 100),
      deliveryAddress,
      deliveryDate,
    })

    // Create order with all required fields
    let orderResult
    try {
      orderResult = await sql`
        INSERT INTO orders (
          user_id, 
          plan_id,
          status, 
          total_amount,
          delivery_address,
          delivery_date,
          created_at,
          updated_at
        ) 
        VALUES (
          ${userId}, 
          ${planId},
          'pending', 
          ${Math.round(totalAmount * 100)},
          ${deliveryAddress},
          ${deliveryDate.toISOString()},
          ${now.toISOString()},
          ${now.toISOString()}
        )
        RETURNING id
      `
    } catch (orderError) {
      console.log("Order creation failed:", orderError)
      return NextResponse.json(
        {
          error: "Failed to create order",
          details: orderError instanceof Error ? orderError.message : String(orderError),
        },
        { status: 500 },
      )
    }

    const orderId = orderResult[0].id
    console.log("Created order with ID:", orderId)

    // Add order items
    try {
      for (const item of cartItems) {
        await sql`
          INSERT INTO order_items (
            order_id, 
            product_id, 
            quantity, 
            price_at_purchase,
            created_at
          ) 
          VALUES (
            ${orderId}, 
            ${item.productId}, 
            ${item.quantity}, 
            ${Math.round(item.price * 100)},
            ${now.toISOString()}
          )
        `
      }
      console.log("Added order items successfully")
    } catch (itemsError) {
      console.log("Failed to add order items:", itemsError)
      // Continue anyway, order is created
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
