import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subscriptionId = Number.parseInt(params.id)
    const { resumeDate } = await request.json()

    if (isNaN(subscriptionId)) {
      return NextResponse.json({ error: "Invalid subscription ID" }, { status: 400 })
    }

    console.log("Resuming subscription:", subscriptionId, "on:", resumeDate)

    // Check if order exists
    const orders = await sql`
      SELECT id, status FROM orders WHERE id = ${subscriptionId}
    `

    if (orders.length === 0) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // Update order status to active
    await sql`
      UPDATE orders 
      SET status = 'active'
      WHERE id = ${subscriptionId}
    `

    // TODO: Update delivery schedules when deliveries table is ready
    // For now, just return success

    const message = resumeDate
      ? `Subscription will resume on ${new Date(resumeDate).toLocaleDateString()}`
      : "Subscription resumed successfully"

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error) {
    console.error("Error resuming subscription:", error)
    return NextResponse.json({ error: "Failed to resume subscription" }, { status: 500 })
  }
}
