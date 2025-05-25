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

    // Create a transaction
    const result = await sql.transaction(async (tx) => {
      // Create the order
      const orderType =
        body.order.mealPlan && body.order.cartItems.length > 0
          ? "mixed"
          : body.order.mealPlan
            ? "meal_plan"
            : "express_shop"

      const totalAmount = body.order.cartSubtotal + body.order.mealPlanTotal + body.order.shipping

      const orderResult = await tx`
        INSERT INTO orders (
          user_id, 
          status, 
          order_type, 
          total_amount, 
          delivery_address, 
          delivery_date
        ) 
        VALUES (
          ${userId}, 
          'pending', 
          ${orderType}, 
          ${totalAmount}, 
          ${body.shipping.address}, 
          ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)}
        )
        RETURNING id
      `

      const orderId = orderResult[0].id

      // If there are express shop items, add them to order_items
      if (body.order.cartItems && body.order.cartItems.length > 0) {
        for (const item of body.order.cartItems) {
          await tx`
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
              ${item.price}
            )
          `
        }

        // Clear the cart using cartId from cookies
        const cartId = request.headers
          .get("cookie")
          ?.split(";")
          .find((c) => c.trim().startsWith("cartId="))
          ?.split("=")[1]

        if (cartId) {
          await tx`
            DELETE FROM cart
            WHERE id = ${cartId}
          `
        }
      }

      // If there's a meal plan, add it to the order
      if (body.order.mealPlan) {
        // In a real implementation, you would create a subscription record
        // For now, we'll just note it in the order
        await tx`
          UPDATE orders
          SET plan_id = ${body.order.mealPlan.planId || null}
          WHERE id = ${orderId}
        `
      }

      // Save customer phone number to user profile if not already set
      if (body.customer.phone) {
        await tx`
          UPDATE users
          SET phone = COALESCE(phone, ${body.customer.phone})
          WHERE id = ${userId}
        `
      }

      return { orderId, userId }
    })

    // Prepare order data for email
    const orderData = {
      id: result.orderId,
      customer: {
        ...body.customer,
        isNewAccount: !user && body.customer.tempPassword ? true : false,
      },
      shipping: {
        ...body.shipping,
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      items: [
        ...(body.order.cartItems || []).map((item: any) => ({
          name: `Product #${item.productId}`,
          quantity: item.quantity,
          price: item.price,
        })),
        ...(body.order.mealPlan
          ? [
              {
                name: `${body.order.mealPlan.mealType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Meal Plan`,
                quantity: 1,
                price: body.order.mealPlan.totalPrice,
              },
            ]
          : []),
      ],
      subtotal: body.order.cartSubtotal + body.order.mealPlanTotal,
      shipping: body.order.shipping,
      total: body.order.cartSubtotal + body.order.mealPlanTotal + body.order.shipping,
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(orderData)
    } catch (emailError) {
      console.error("Error sending order confirmation email:", emailError)
      // Continue with the response even if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      userId: result.userId,
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
