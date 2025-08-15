import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Delivery {
  id: number
  orderId: number
  scheduledDate: string
  status: "pending" | "delivered" | "skipped" | "paused"
  deliveredAt?: string
  createdAt: string
  updatedAt: string
}

export interface DeliverySchedule {
  deliveries: Delivery[]
  totalDeliveries: number
  completedDeliveries: number
  pendingDeliveries: number
  nextDeliveryDate?: string
  canPause: boolean
  pauseEligibleDate?: string
}

export class DeliveryService {
  // Generate delivery schedule for a new order
  static async generateDeliverySchedule(orderId: number, startDate: Date, totalDeliveries = 8): Promise<void> {
    try {
      // Check if deliveries already exist for this order
      const existingDeliveries = await sql`
        SELECT COUNT(*) as count FROM deliveries WHERE order_id = ${orderId}
      `

      if (existingDeliveries[0]?.count > 0) {
        console.log(`Deliveries already exist for order ${orderId}`)
        return
      }

      const deliveries: Array<{ orderId: number; scheduledDate: string }> = []
      const deliveryDate = new Date(startDate)

      // Generate weekly deliveries (every 7 days)
      for (let i = 0; i < totalDeliveries; i++) {
        // Add 7 days for each delivery (weekly schedule)
        const scheduledDate = new Date(deliveryDate.getTime() + i * 7 * 24 * 60 * 60 * 1000)

        deliveries.push({
          orderId,
          scheduledDate: scheduledDate.toISOString().split("T")[0],
        })
      }

      // Insert all deliveries
      for (const delivery of deliveries) {
        await sql`
          INSERT INTO deliveries (order_id, scheduled_date, status)
          VALUES (${delivery.orderId}, ${delivery.scheduledDate}, 'pending')
        `
      }

      console.log(`Generated ${deliveries.length} deliveries for order ${orderId}`)
    } catch (error) {
      console.error("Error generating delivery schedule:", error)
      throw error
    }
  }

  // Get delivery schedule for an order
  static async getDeliverySchedule(orderId: number): Promise<DeliverySchedule> {
    try {
      const deliveries = await sql`
        SELECT 
          id,
          order_id as "orderId",
          scheduled_date as "scheduledDate",
          status,
          delivered_at as "deliveredAt",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM deliveries 
        WHERE order_id = ${orderId}
        ORDER BY scheduled_date ASC
      `

      const totalDeliveries = deliveries.length
      const completedDeliveries = deliveries.filter((d) => d.status === "delivered").length
      const pendingDeliveries = deliveries.filter((d) => d.status === "pending").length

      // Find next pending delivery
      const nextDelivery = deliveries.find((d) => d.status === "pending")
      const nextDeliveryDate = nextDelivery?.scheduledDate

      // Check if we can pause (next delivery is at least 72 hours away)
      const now = new Date()
      const minPauseTime = new Date(now.getTime() + 72 * 60 * 60 * 1000) // 72 hours from now

      let canPause = false
      let pauseEligibleDate: string | undefined

      if (nextDelivery) {
        const nextDeliveryDateTime = new Date(nextDelivery.scheduledDate)
        canPause = nextDeliveryDateTime > minPauseTime

        if (!canPause) {
          // Find the first delivery that's eligible for pause
          const eligibleDelivery = deliveries.find(
            (d) => d.status === "pending" && new Date(d.scheduledDate) > minPauseTime,
          )
          pauseEligibleDate = eligibleDelivery?.scheduledDate
        }
      }

      return {
        deliveries: deliveries as Delivery[],
        totalDeliveries,
        completedDeliveries,
        pendingDeliveries,
        nextDeliveryDate,
        canPause,
        pauseEligibleDate,
      }
    } catch (error) {
      console.error("Error getting delivery schedule:", error)
      throw error
    }
  }

  // Pause subscription
  static async pauseSubscription(orderId: number, pauseDurationDays: number): Promise<void> {
    try {
      const now = new Date()

      // Update order status
      await sql`
        UPDATE orders 
        SET 
          status = 'paused',
          paused_at = ${now.toISOString()}
        WHERE id = ${orderId}
      `
      console.log(`Order ${orderId} has been paused for ${pauseDurationDays} days`)
    } catch (error) {
      console.error("Error pausing subscription:", error)
      throw error
    }
  }
}
