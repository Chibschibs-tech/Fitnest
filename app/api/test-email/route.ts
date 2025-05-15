import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { sendWelcomeEmail, sendOrderConfirmationEmail, sendDeliveryUpdateEmail } from "@/lib/email-utils"

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
    const { type, email, name } = body

    if (!type || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let result

    switch (type) {
      case "welcome":
        if (!name) {
          return NextResponse.json({ error: "Name is required for welcome email" }, { status: 400 })
        }
        result = await sendWelcomeEmail(email, name)
        break

      case "order_confirmation":
        // Mock order data for testing
        const orderData = {
          id: "TEST-12345",
          customer: {
            name: name || "Test User",
            email: email,
          },
          shipping: {
            address: "123 Test Street, Casablanca",
            city: "Casablanca",
            postalCode: "20000",
            deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          items: [
            {
              name: "Test Product 1",
              quantity: 2,
              price: 59.99,
            },
            {
              name: "Test Product 2",
              quantity: 1,
              price: 29.99,
            },
          ],
          subtotal: 149.97,
          shipping: 0,
          total: 149.97,
        }
        result = await sendOrderConfirmationEmail(orderData)
        break

      case "delivery_update":
        // Mock delivery data for testing
        const deliveryData = {
          id: "TEST-12345",
          customer: {
            firstName: name?.split(" ")[0] || "Test",
            email: email,
          },
          shipping: {
            address: "123 Test Street, Casablanca",
            city: "Casablanca",
            postalCode: "20000",
            deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
        }
        result = await sendDeliveryUpdateEmail(deliveryData)
        break

      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Test ${type} email sent to ${email}`,
      result,
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
