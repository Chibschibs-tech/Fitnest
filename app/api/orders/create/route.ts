import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { sendOrderConfirmationEmail } from "@/lib/email-utils"

export async function POST(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user ID
    const userId = session.user.id

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.customer || !body.shipping || !body.order) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

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

        // Clear the cart
        await tx`
          DELETE FROM cart_items
          WHERE user_id = ${userId}
        `
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

      return { orderId }
    })

    // Prepare order data for email
    const orderData = {
      id: result.orderId,
      customer: body.customer,
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
