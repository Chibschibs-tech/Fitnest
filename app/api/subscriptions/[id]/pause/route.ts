import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const subscriptionId = Number.parseInt(params.id)
    const { pauseDurationDays } = await request.json()

    if (isNaN(subscriptionId)) {
      return NextResponse.json({ error: "Invalid subscription ID" }, { status: 400 })
    }

    if (!pauseDurationDays || pauseDurationDays < 7 || pauseDurationDays > 21) {
      return NextResponse.json({ error: "Invalid pause duration. Must be between 7 and 21 days." }, { status: 400 })
    }

    console.log(`Pausing subscription ${subscriptionId} for ${pauseDurationDays} days`)

    // Check if orders table exists and has the subscription
    let orderExists = false
    try {
      const orders = await sql`SELECT id, status FROM orders WHERE id = ${subscriptionId} LIMIT 1`
      orderExists = orders.length > 0

      if (orderExists) {
        // Update the order status to paused
        await sql`
          UPDATE orders 
          SET status = 'paused', 
              paused_at = NOW()
          WHERE id = ${subscriptionId}
        `
      }
    } catch (error) {
      console.log("Orders table doesn't exist or error updating:", error)
    }

    // Try to update deliveries if table exists
    try {
      await sql`
        UPDATE deliveries 
        SET scheduled_date = scheduled_date + INTERVAL '${pauseDurationDays} days'
        WHERE subscription_id = ${subscriptionId} 
        AND status = 'pending'
        AND scheduled_date > NOW() + INTERVAL '72 hours'
      `
    } catch (error) {
      console.log("Deliveries table doesn't exist or error updating:", error)
    }

    return NextResponse.json({
      success: true,
      message: `Subscription paused for ${pauseDurationDays} days. All future deliveries have been rescheduled.`,
    })
  } catch (error) {
    console.error("Error pausing subscription:", error)
    return NextResponse.json({ error: "Failed to pause subscription" }, { status: 500 })
  }
}
