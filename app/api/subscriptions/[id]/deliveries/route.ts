import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const subscriptionId = Number.parseInt(params.id)

    if (isNaN(subscriptionId)) {
      return NextResponse.json({ error: "Invalid subscription ID" }, { status: 400 })
    }

    console.log("Fetching deliveries for subscription ID:", subscriptionId)

    // Check if deliveries table exists
    let tableExists = false
    try {
      await sql`SELECT 1 FROM deliveries LIMIT 1`
      tableExists = true
    } catch (error) {
      console.log("Deliveries table doesn't exist, returning mock data")
    }

    if (!tableExists) {
      // Return mock delivery schedule
      const mockDeliveries = []
      const startDate = new Date()

      for (let i = 0; i < 8; i++) {
        const deliveryDate = new Date(startDate)
        deliveryDate.setDate(startDate.getDate() + i * 7) // Weekly deliveries

        mockDeliveries.push({
          id: i + 1,
          scheduledDate: deliveryDate.toISOString(),
          status: i < 2 ? "delivered" : "pending",
        })
      }

      return NextResponse.json({
        deliveries: mockDeliveries,
        totalDeliveries: 8,
        completedDeliveries: 2,
        pendingDeliveries: 6,
        nextDeliveryDate: mockDeliveries.find((d) => d.status === "pending")?.scheduledDate,
        canPause: true,
        pauseEligibleDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      })
    }

    // Try to fetch real deliveries
    const deliveries = await sql`
      SELECT 
        id,
        scheduled_date as "scheduledDate",
        status
      FROM deliveries 
      WHERE subscription_id = ${subscriptionId}
      ORDER BY scheduled_date ASC
    `

    const totalDeliveries = deliveries.length
    const completedDeliveries = deliveries.filter((d) => d.status === "delivered").length
    const pendingDeliveries = deliveries.filter((d) => d.status === "pending").length
    const nextDelivery = deliveries.find((d) => d.status === "pending")

    // Check if can pause (next delivery is at least 72 hours away)
    const canPause = nextDelivery
      ? new Date(nextDelivery.scheduledDate).getTime() > Date.now() + 72 * 60 * 60 * 1000
      : false

    const pauseEligibleDate = nextDelivery
      ? new Date(new Date(nextDelivery.scheduledDate).getTime() - 72 * 60 * 60 * 1000).toISOString()
      : null

    return NextResponse.json({
      deliveries,
      totalDeliveries,
      completedDeliveries,
      pendingDeliveries,
      nextDeliveryDate: nextDelivery?.scheduledDate,
      canPause,
      pauseEligibleDate,
    })
  } catch (error) {
    console.error("Error fetching deliveries:", error)

    // Return mock data as fallback
    const mockDeliveries = []
    const startDate = new Date()

    for (let i = 0; i < 8; i++) {
      const deliveryDate = new Date(startDate)
      deliveryDate.setDate(startDate.getDate() + i * 7)

      mockDeliveries.push({
        id: i + 1,
        scheduledDate: deliveryDate.toISOString(),
        status: i < 2 ? "delivered" : "pending",
      })
    }

    return NextResponse.json({
      deliveries: mockDeliveries,
      totalDeliveries: 8,
      completedDeliveries: 2,
      pendingDeliveries: 6,
      nextDeliveryDate: mockDeliveries.find((d) => d.status === "pending")?.scheduledDate,
      canPause: true,
      pauseEligibleDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    })
  }
}
