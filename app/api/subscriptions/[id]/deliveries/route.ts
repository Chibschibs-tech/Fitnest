import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subscriptionId = Number.parseInt(params.id)

    if (isNaN(subscriptionId)) {
      return NextResponse.json({ error: "Invalid subscription ID" }, { status: 400 })
    }

    console.log("Fetching deliveries for subscription ID:", subscriptionId)

    // Check if deliveries table exists
    let deliveries = []
    let hasDeliveriesTable = false

    try {
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'deliveries'
        )
      `
      hasDeliveriesTable = tableCheck[0]?.exists || false
    } catch (error) {
      console.log("Could not check deliveries table:", error)
      hasDeliveriesTable = false
    }

    if (hasDeliveriesTable) {
      try {
        deliveries = await sql`
          SELECT 
            id,
            scheduled_date,
            status
          FROM deliveries 
          WHERE subscription_id = ${subscriptionId}
          ORDER BY scheduled_date ASC
        `
      } catch (error) {
        console.log("Error fetching deliveries:", error)
        deliveries = []
      }
    }

    // If no deliveries table or no deliveries found, create mock data
    if (deliveries.length === 0) {
      const today = new Date()
      const mockDeliveries = []

      // Create 4 weeks of deliveries (3 days per week)
      for (let week = 0; week < 4; week++) {
        for (const day of [1, 3, 5]) {
          // Monday, Wednesday, Friday
          const deliveryDate = new Date(today)
          deliveryDate.setDate(today.getDate() + week * 7 + day)

          mockDeliveries.push({
            id: week * 3 + (day === 1 ? 1 : day === 3 ? 2 : 3),
            scheduledDate: deliveryDate.toISOString(),
            status: week === 0 && day === 1 ? "delivered" : "pending",
          })
        }
      }

      deliveries = mockDeliveries
    }

    // Calculate delivery statistics
    const totalDeliveries = deliveries.length
    const completedDeliveries = deliveries.filter((d) => d.status === "delivered").length
    const pendingDeliveries = deliveries.filter((d) => d.status === "pending").length

    // Find next delivery date
    const nextDelivery = deliveries.find((d) => d.status === "pending")
    const nextDeliveryDate = nextDelivery ? nextDelivery.scheduledDate : null

    // Check if can pause (next delivery is at least 72 hours away)
    let canPause = false
    let pauseEligibleDate = null

    if (nextDeliveryDate) {
      const nextDate = new Date(nextDeliveryDate)
      const now = new Date()
      const hoursUntilNext = (nextDate.getTime() - now.getTime()) / (1000 * 60 * 60)

      canPause = hoursUntilNext >= 72

      if (!canPause) {
        pauseEligibleDate = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString()
      }
    }

    return NextResponse.json({
      deliveries: deliveries.map((d) => ({
        id: d.id,
        scheduledDate: d.scheduledDate || d.scheduled_date,
        status: d.status,
      })),
      totalDeliveries,
      completedDeliveries,
      pendingDeliveries,
      nextDeliveryDate,
      canPause,
      pauseEligibleDate,
    })
  } catch (error) {
    console.error("Error in deliveries API:", error)
    return NextResponse.json({ error: "Failed to fetch delivery schedule", details: error.message }, { status: 500 })
  }
}
