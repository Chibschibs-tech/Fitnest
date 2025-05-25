import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"
import { hashPassword } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()

    console.log("Received order data:", body)

    // Validate required fields
    if (!body.customer || !body.shipping || !body.order) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user session
    const sessionId = request.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("session-id="))
      ?.split("=")[1]

    let userId = null
    let user = null

    if (sessionId) {
      user = await getSessionUser(sessionId)
      userId = user?.id
    }

    // If no user, create one
    if (!userId) {
      console.log("Creating new user account")

      const existingUser = await sql`
        SELECT id FROM users WHERE email = ${body.customer.email}
      `

      if (existingUser.length > 0) {
        userId = existingUser[0].id
      } else {
        const tempPassword = Math.random().toString(36).slice(-8)
        const hashedPassword = hashPassword(tempPassword)

        const newUser = await sql`
          INSERT INTO users (name, email, password, role) 
          VALUES (
            ${`${body.customer.firstName} ${body.customer.lastName}`}, 
            ${body.customer.email}, 
            ${hashedPassword},
            'user'
          )
          RETURNING id
        `
        userId = newUser[0].id
      }
    }

    // Get cart items using the cart table
    const cartId = request.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("cartId="))
      ?.split("=")[1]

    let cartItems = []
    if (cartId) {
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

      cartItems = items.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        name: item.name,
        price: (item.saleprice || item.price) / 100, // Convert from cents
      }))
    }

    // Calculate totals
    const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = body.order.shipping || 0
    const totalAmount = cartSubtotal + shippingCost

    console.log("Order totals:", { cartSubtotal, shippingCost, totalAmount })

    // Create the order
    const orderResult = await sql`
      INSERT INTO orders (
        user_id, 
        status, 
        total_amount, 
        shipping_address,
        created_at
      ) 
      VALUES (
        ${userId}, 
        'pending', 
        ${Math.round(totalAmount * 100)}, 
        ${JSON.stringify({
          address: body.shipping.address,
          city: body.shipping.city,
          postalCode: body.shipping.postalCode,
          notes: body.shipping.notes,
          deliveryOption: body.shipping.deliveryOption,
        })},
        CURRENT_TIMESTAMP
      )
      RETURNING id
    `

    const orderId = orderResult[0].id
    console.log("Created order with ID:", orderId)

    // Add cart items to order_items
    if (cartItems.length > 0) {
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

      // Clear the cart using the cart table
      await sql`DELETE FROM cart WHERE id = ${cartId}`
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      userId: userId,
      message: "Order created successfully",
    })
  } catch (error) {
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
