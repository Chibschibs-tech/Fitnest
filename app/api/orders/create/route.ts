import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"
import { sendOrderConfirmationEmail } from "@/lib/email-utils"
import { hashPassword } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    // Initialize Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.customer || !body.shipping || !body.order) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user session from cookies
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

    // If user is not authenticated, create a new user account
    if (!userId) {
      console.log("No authenticated user found, creating new account from checkout information")

      // Check if user with this email already exists
      const existingUser = await sql`
        SELECT id FROM users WHERE email = ${body.customer.email}
      `

      if (existingUser.length > 0) {
        // User exists, use their ID
        userId = existingUser[0].id
        console.log("Found existing user with this email, using their ID:", userId)
      } else {
        // Generate a random password (user can reset it later)
        const tempPassword = Math.random().toString(36).slice(-8)
        const hashedPassword = hashPassword(tempPassword)

        // Create new user
        const newUser = await sql`
          INSERT INTO users (
            name, 
            email, 
            password,
            role
          ) 
          VALUES (
            ${`${body.customer.firstName} ${body.customer.lastName}`}, 
            ${body.customer.email}, 
            ${hashedPassword},
            'user'
          )
          RETURNING id
        `

        userId = newUser[0].id
        console.log("Created new user account with ID:", userId)

        // Store the temporary password to send in email
        body.customer.tempPassword = tempPassword
      }
    }

    // Get cart items for the order
    const cartId = request.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("cartId="))
      ?.split("=")[1]

    let cartItems = []
    let cartSubtotal = 0

    if (cartId) {
      // Get cart items with product details
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

      cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    // Calculate totals
    const mealPlanTotal = body.order.mealPlanTotal || 0
    const shippingCost = body.order.shipping || 0
    const totalAmount = cartSubtotal + mealPlanTotal + shippingCost

    // Create the order
    const orderResult = await sql`
      INSERT INTO orders (
        user_id, 
        status, 
        order_type, 
        total_amount, 
        delivery_address, 
        delivery_date,
        created_at
      ) 
      VALUES (
        ${userId}, 
        'pending', 
        ${cartItems.length > 0 && mealPlanTotal > 0 ? "mixed" : cartItems.length > 0 ? "express_shop" : "meal_plan"}, 
        ${Math.round(totalAmount * 100)}, 
        ${body.shipping.address}, 
        ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)},
        CURRENT_TIMESTAMP
      )
      RETURNING id
    `

    const orderId = orderResult[0].id

    // Add cart items to order_items if any
    if (cartItems.length > 0) {
      for (const item of cartItems) {
        await sql`
          INSERT INTO order_items (
            order_id, 
            product_id, 
            quantity, 
            price_at_purchase
          ) 
          VALUES (
            ${orderId}, 
            ${item.productId}, 
            ${item.quantity}, 
            ${Math.round(item.price * 100)}
          )
        `
      }

      // Clear the cart
      await sql`
        DELETE FROM cart
        WHERE id = ${cartId}
      `
    }

    // Save customer phone number to user profile if provided
    if (body.customer.phone) {
      await sql`
        UPDATE users
        SET phone = COALESCE(phone, ${body.customer.phone})
        WHERE id = ${userId}
      `
    }

    // Prepare order data for email
    const orderData = {
      id: orderId,
      customer: {
        ...body.customer,
        isNewAccount: !user && body.customer.tempPassword ? true : false,
      },
      shipping: {
        ...body.shipping,
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      items: [
        ...cartItems.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        ...(mealPlanTotal > 0
          ? [
              {
                name: "Meal Plan Subscription",
                quantity: 1,
                price: mealPlanTotal,
              },
            ]
          : []),
      ],
      subtotal: cartSubtotal + mealPlanTotal,
      shipping: shippingCost,
      total: totalAmount,
    }

    // Send order confirmation email (optional, continue if fails)
    try {
      await sendOrderConfirmationEmail(orderData)
    } catch (emailError) {
      console.error("Error sending order confirmation email:", emailError)
      // Continue with the response even if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      userId: userId,
      isNewAccount: !user && body.customer.tempPassword ? true : false,
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
