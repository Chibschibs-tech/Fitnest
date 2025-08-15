import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { DeliveryService } from "@/lib/delivery-service"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)
    const { resumeDate } = await request.json()

    // Check if order exists and is paused
    const orderResult = await sql`
      SELECT id, status, paused_at 
      FROM orders 
      WHERE id = ${orderId}
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 })
    }

    const order = orderResult[0]

    if (order.status !== "paused") {
      return NextResponse.json({ success: false, message: "Subscription is not currently paused" }, { status: 400 })
    }

    // Validate resume date if provided (must be at least 48 hours from now)
    if (resumeDate) {
      const targetDate = new Date(resumeDate)
      const minResumeDate = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours from now

      if (targetDate < minResumeDate) {
        return NextResponse.json(
          { success: false, message: "Resume date must be at least 48 hours from now" },
          { status: 400 },
        )
      }
    }

    // Resume the subscription
    await DeliveryService.resumeSubscription(orderId, resumeDate)

    const message = resumeDate
      ? `Subscription resumed. Deliveries will restart on ${new Date(resumeDate).toLocaleDateString()}.`
      : "Subscription resumed successfully."

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error) {
    console.error("Error resuming subscription:", error)
    return NextResponse.json({ success: false, message: "Failed to resume subscription" }, { status: 500 })
  }
}
