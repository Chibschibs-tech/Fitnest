import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { DeliveryService } from "@/lib/delivery-service"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)
    const { pauseDurationDays } = await request.json()

    // Validate pause duration (1-21 days)
    if (!pauseDurationDays || pauseDurationDays < 1 || pauseDurationDays > 21) {
      return NextResponse.json(
        { success: false, message: "Pause duration must be between 1 and 21 days" },
        { status: 400 },
      )
    }

    // Check if order exists and get current status
    const orderResult = await sql`
      SELECT id, status, pause_count 
      FROM orders 
      WHERE id = ${orderId}
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 })
    }

    const order = orderResult[0]

    // Check if already paused
    if (order.status === "paused") {
      return NextResponse.json({ success: false, message: "Subscription is already paused" }, { status: 400 })
    }

    // Check pause count limit
    if ((order.pause_count || 0) >= 1) {
      return NextResponse.json({ success: false, message: "You can only pause once per subscription" }, { status: 400 })
    }

    // Check if we can pause (72-hour rule)
    const deliverySchedule = await DeliveryService.getDeliverySchedule(orderId)
    if (!deliverySchedule.canPause) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot pause subscription. Deliveries must be at least 72 hours away.",
          pauseEligibleDate: deliverySchedule.pauseEligibleDate,
        },
        { status: 400 },
      )
    }

    // Pause the subscription
    await DeliveryService.pauseSubscription(orderId, pauseDurationDays)

    return NextResponse.json({
      success: true,
      message: `Subscription paused for ${pauseDurationDays} days. All remaining deliveries have been shifted accordingly.`,
    })
  } catch (error) {
    console.error("Error pausing subscription:", error)
    return NextResponse.json({ success: false, message: "Failed to pause subscription" }, { status: 500 })
  }
}
