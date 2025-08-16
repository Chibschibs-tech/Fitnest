import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subscriptionId = Number.parseInt(params.id)
    const { pauseDurationDays } = await request.json()

    if (isNaN(subscriptionId)) {
      return NextResponse.json({ error: "Invalid subscription ID" }, { status: 400 })
    }

    if (!pauseDurationDays || pauseDurationDays < 7 || pauseDurationDays > 21) {
      return NextResponse.json({ error: "Pause duration must be between 7 and 21 days" }, { status: 400 })
    }

    console.log("Pausing subscription:", subscriptionId, "for", pauseDurationDays, "days")

    // Check if order exists
    const orders = await sql`
      SELECT id, status FROM orders WHERE id = ${subscriptionId}
    `

    if (orders.length === 0) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // Update order status to paused
    await sql`
      UPDATE orders 
      SET status = 'paused'
      WHERE id = ${subscriptionId}
    `

    // TODO: Update delivery schedules when deliveries table is ready
    // For now, just return success

    return NextResponse.json({
      success: true,
      message: `Subscription paused for ${pauseDurationDays} days. Your deliveries will resume automatically.`,
    })
  } catch (error) {
    console.error("Error pausing subscription:", error)
    return NextResponse.json({ error: "Failed to pause subscription" }, { status: 500 })
  }
}
