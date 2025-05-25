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

    // Get cart items using the correct structure
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
        // First, get cart items from cart table (cart.id = cartId)
        const items = await sql`
          SELECT 
            c.product_id,
            c.quantity,
            p.name,
            p.price,
            p.sale_price
          FROM cart c
          JOIN products p ON c.product_id = p.id::text
          WHERE c.id = ${cartId}
        `

        console.log("Raw cart items from DB:", items)

        cartItems = items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          name: item.name,
          price: Number(item.sale_price || item.price), // Keep as decimal, don't divide by 100
        }))

        cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        console.log("Processed cart items:", cartItems)
        console.log("Cart subtotal:", cartSubtotal)
      } catch (cartError) {
        console.log("Error fetching cart items:", cartError)

        // Try alternative query if the first one fails
        try {
          const items = await sql`
            SELECT 
              c.product_id,
              c.quantity,
              p.name,
              p.price,
              p.sale_price
            FROM cart c
            JOIN products p ON c.product_id::text = p.id
            WHERE c.id = ${cartId}
          `

          cartItems = items.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            name: item.name,
            price: Number(item.sale_price || item.price),
          }))

          cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          console.log("Alternative query - Processed cart items:", cartItems)
          console.log("Alternative query - Cart subtotal:", cartSubtotal)
        } catch (altError) {
          console.log("Alternative cart query also failed:", altError)
        }
      }
    }

    // Handle meal plan data
    const mealPlan = body.order.mealPlan
    let mealPlanPrice = 0
    if (mealPlan) {
      mealPlanPrice = mealPlan.planPrice || mealPlan.price || 0
      console.log("Meal plan data:", mealPlan)
      console.log("Meal plan price:", mealPlanPrice)
    }

    // Check if we have either cart items or meal plan
    if (cartItems.length === 0 && !mealPlan) {
      console.log("No cart items or meal plan found")
      return NextResponse.json({ error: "No items in cart or meal plan selected" }, { status: 400 })
    }

    // Calculate totals
    const shippingCost = body.order.shipping || 0
    const totalAmount = cartSubtotal + mealPlanPrice + shippingCost

    console.log("Final totals:", { cartSubtotal, mealPlanPrice, shippingCost, totalAmount })

    // Prepare required fields for orders table
    const deliveryAddress = `${body.shipping.address}, ${body.shipping.city}, ${body.shipping.postalCode}`
    const now = new Date()

    console.log("Order details:", {
      userId,
      totalAmount: Math.round(totalAmount * 100),
      deliveryAddress,
    })

    // Create order with existing database structure
    let orderResult
    try {
      orderResult = await sql`
        INSERT INTO orders (
          user_id, 
          total_amount,
          status,
          shipping_address,
          billing_address,
          created_at,
          updated_at
        ) 
        VALUES (
          ${userId}, 
          ${Math.round(totalAmount * 100)},
          'pending',
          ${deliveryAddress},
          ${deliveryAddress},
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

    // Add order items (cart items)
    try {
      for (const item of cartItems) {
        await sql`
          INSERT INTO order_items (
            order_id, 
            product_id, 
            quantity, 
            price,
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
      if (cartId) {
        await sql`DELETE FROM cart WHERE id = ${cartId}`
        console.log("Cleared cart successfully")
      }
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
