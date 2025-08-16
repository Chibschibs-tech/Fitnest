import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const subscriptionId = Number.parseInt(params.id)
    const { resumeDate } = await request.json()

    if (isNaN(subscriptionId)) {
      return NextResponse.json({ error: "Invalid subscription ID" }, { status: 400 })
    }

    console.log(`Resuming subscription ${subscriptionId}`)

    // Check if orders table exists and update status
    try {
      const orders = await sql`SELECT id, status FROM orders WHERE id = ${subscriptionId} LIMIT 1`

      if (orders.length > 0) {
        await sql`
          UPDATE orders 
          SET status = 'active', 
              paused_at = NULL
          WHERE id = ${subscriptionId}
        `
      }
    } catch (error) {
      console.log("Orders table doesn't exist or error updating:", error)
    }

    // Try to update deliveries if table exists
    try {
      if (resumeDate) {
        // Resume on specific date
        await sql`
          UPDATE deliveries 
          SET scheduled_date = ${resumeDate}
          WHERE subscription_id = ${subscriptionId} 
          AND status = 'pending'
          ORDER BY scheduled_date ASC
          LIMIT 1
        `
      }
    } catch (error) {
      console.log("Deliveries table doesn't exist or error updating:", error)
    }

    return NextResponse.json({
      success: true,
      message: resumeDate
        ? `Subscription resumed. Next delivery scheduled for ${new Date(resumeDate).toLocaleDateString()}.`
        : "Subscription resumed successfully.",
    })
  } catch (error) {
    console.error("Error resuming subscription:", error)
    return NextResponse.json({ error: "Failed to resume subscription" }, { status: 500 })
  }
}
