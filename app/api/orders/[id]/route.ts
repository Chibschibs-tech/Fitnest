import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { neon } from "@neondatabase/serverless"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const orderId = params.id

    // Get the order with user check
    const orders = await sql`
      SELECT o.*, mp.name as plan_name, mp.description as plan_description, mp.type as plan_type
      FROM orders o
      LEFT JOIN meal_plans mp ON o.plan_id = mp.id
      WHERE o.id = ${orderId} AND o.user_id = ${user.id}
    `

    if (orders.length === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    const order = orders[0]

    // Get order items
    const orderItems = await sql`
      SELECT oi.*, p.name, p.price, p.saleprice, p.imageurl
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderId}
    `

    // Transform the order data to match what the frontend expects
    const transformedOrder = {
      id: order.id,
      date: order.created_at,
      status: order.status || "pending",
      type: order.plan_id ? "meal_plan" : "mixed",
      customer: {
        name: user.name || user.email,
        email: user.email,
        phone: user.phone || "+212 612345678",
      },
      shipping: {
        address: order.delivery_address || "Address not provided",
        city: "Casablanca",
        postalCode: "20000",
        deliveryDate: order.delivery_date || order.created_at,
      },
      payment: {
        method: order.payment_method || "Cash on Delivery",
        status: order.payment_status || "Pending",
      },
      items: orderItems.map((item) => ({
        id: item.id,
        type: "product",
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageurl,
      })),
      subtotal: order.total_amount,
      shipping: 0,
      total: order.total_amount,
    }

    return NextResponse.json({ order: transformedOrder })
  } catch (error) {
    console.error("Error fetching order details:", error)
    return NextResponse.json({ message: "Failed to load order details" }, { status: 500 })
  }
}
