import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    // Get user from session/cookie instead of profile
    const cookies = req.headers.get("cookie")
    const userId = null

    // Try to get user from session cookie if logged in
    if (cookies?.includes("session=")) {
      // For now, we'll handle both logged-in and guest orders
      // This matches the existing order creation logic
    }

    const {
      cartItems,
      cartSubtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      billingAddress,
      paymentMethod,
      orderNotes,
    } = await req.json()

    interface OrderRequest {
      cartItems: any[]
      cartSubtotal: number
      shipping: number
      tax: number
      total: number
      shippingAddress: any
      billingAddress: any
      paymentMethod: string
      orderNotes: string
      mealPlan?: {
        planId: string
        planName: string
        planPrice: number
        duration: string
        mealsPerWeek: number
        customizations?: any
        deliverySchedule?: any
      }
    }

    const order: OrderRequest = await req.json()

    if (
      !order.cartItems ||
      !order.cartSubtotal ||
      !order.shipping ||
      !order.tax ||
      !order.total ||
      !order.shippingAddress ||
      !order.billingAddress ||
      !order.paymentMethod
    ) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const orderId = uuidv4()
    let paramCount = 1

    const totalAmount = order.cartSubtotal + (order.mealPlan?.planPrice || 0) + order.shipping

    const insertOrderQuery = `
      INSERT INTO orders (
        id,
        profile_id,
        cart_subtotal,
        shipping,
        tax,
        total,
        shipping_address,
        billing_address,
        payment_method,
        order_notes,
        meal_plan_id,
        meal_plan_name,
        meal_plan_price,
        meal_plan_duration,
        meal_plan_meals_per_week,
        meal_plan_customizations
      ) VALUES (
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++},
        $${paramCount++}
      )
    `

    const orderParams = [
      orderId,
      "profile.id", // Replace with actual profile ID if available
      order.cartSubtotal,
      order.shipping,
      order.tax,
      totalAmount,
      JSON.stringify(order.shippingAddress),
      JSON.stringify(order.billingAddress),
      order.paymentMethod,
      order.orderNotes,
      order.mealPlan?.planId || null,
      order.mealPlan?.planName || null,
      order.mealPlan?.planPrice || null,
      order.mealPlan?.duration || null,
      order.mealPlan?.mealsPerWeek || null,
      JSON.stringify(order.mealPlan?.customizations || null),
    ]

    await db.query(insertOrderQuery, orderParams)

    // Insert cart items into order_items table
    const insertOrderItemQuery = `
      INSERT INTO order_items (
        id,
        order_id,
        product_id,
        quantity,
        price
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
      )
    `

    for (const item of order.cartItems) {
      const orderItemId = uuidv4()
      await db.query(insertOrderItemQuery, [orderItemId, orderId, item.id, item.quantity, item.price])
    }

    return NextResponse.json({ orderId })
  } catch (error) {
    console.log("[ORDERS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
