import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { sendDeliveryUpdateEmail } from "@/lib/email-utils"

export async function POST(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)

    // Check if user is an admin
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.orderId || !body.status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Update order status
    await sql`
      UPDATE orders
      SET status = ${body.status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${body.orderId}
    `

    // Get order details for email notification
    const orderResult = await sql`
      SELECT 
        o.id, 
        o.status, 
        o.delivery_address, 
        o.delivery_date,
        u.name as customer_name,
        u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ${body.orderId}
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orderResult[0]

    // Send delivery update email if status is "processing"
    if (body.status === "processing") {
      try {
        const orderData = {
          id: order.id,
          customer: {
            firstName: order.customer_name.split(" ")[0],
            email: order.customer_email,
          },
          shipping: {
            address: order.delivery_address,
            city: "Casablanca", // Assuming city is part of the address
            postalCode: "20000", // Assuming postal code is part of the address
            deliveryDate: order.delivery_date,
          },
        }

        await sendDeliveryUpdateEmail(orderData)
      } catch (emailError) {
        console.error("Error sending delivery update email:", emailError)
        // Continue with the response even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${body.status}`,
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json(
      {
        error: "Failed to update order status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
