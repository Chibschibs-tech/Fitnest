import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Delivery {
  id: number
  orderId: number
  scheduledDate: string
  status: "pending" | "delivered" | "skipped" | "paused"
  deliveredAt?: string
  notes?: string
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
  static async generateDeliverySchedule(
    orderId: number,
    startDate: Date,
    totalWeeks = 4,
    deliveryDays: string[] = ["monday", "tuesday", "wednesday", "thursday", "friday"],
  ): Promise<void> {
    const deliveries: Array<{ orderId: number; scheduledDate: string }> = []

    // Generate delivery dates for the specified weeks
    const currentDate = new Date(startDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + totalWeeks * 7)

    while (currentDate <= endDate) {
      const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()

      if (deliveryDays.includes(dayName)) {
        deliveries.push({
          orderId,
          scheduledDate: currentDate.toISOString().split("T")[0],
        })
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Insert deliveries into database
    for (const delivery of deliveries) {
      await sql`
        INSERT INTO deliveries (order_id, scheduled_date, status)
        VALUES (${delivery.orderId}, ${delivery.scheduledDate}, 'pending')
      `
    }
  }

  // Get delivery schedule for an order
  static async getDeliverySchedule(orderId: number): Promise<DeliverySchedule> {
    const deliveries = await sql`
      SELECT * FROM deliveries 
      WHERE order_id = ${orderId} 
      ORDER BY scheduled_date ASC
    `

    const totalDeliveries = deliveries.length
    const completedDeliveries = deliveries.filter((d) => d.status === "delivered").length
    const pendingDeliveries = deliveries.filter((d) => d.status === "pending").length

    const nextPendingDelivery = deliveries.find(
      (d) => d.status === "pending" && new Date(d.scheduled_date) > new Date(),
    )

    const nextDeliveryDate = nextPendingDelivery?.scheduled_date

    // Check if pause is possible (72 hours ahead rule)
    const now = new Date()
    const minPauseDate = new Date(now.getTime() + 72 * 60 * 60 * 1000) // 72 hours from now

    const pauseEligibleDelivery = deliveries.find(
      (d) => d.status === "pending" && new Date(d.scheduled_date) >= minPauseDate,
    )

    const canPause = !!pauseEligibleDelivery
    const pauseEligibleDate = pauseEligibleDelivery?.scheduled_date

    return {
      deliveries: deliveries.map((d) => ({
        id: d.id,
        orderId: d.order_id,
        scheduledDate: d.scheduled_date,
        status: d.status,
        deliveredAt: d.delivered_at,
        notes: d.notes,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      })),
      totalDeliveries,
      completedDeliveries,
      pendingDeliveries,
      nextDeliveryDate,
      canPause,
      pauseEligibleDate,
    }
  }

  // Pause subscription
  static async pauseSubscription(
    orderId: number,
    pauseDurationDays: number,
  ): Promise<{ success: boolean; message: string; resumeDate?: string }> {
    try {
      // Check if already paused or pause count exceeded
      const orderResult = await sql`
        SELECT pause_count, status, paused_at FROM orders WHERE id = ${orderId}
      `

      if (orderResult.length === 0) {
        return { success: false, message: "Order not found" }
      }

      const order = orderResult[0]

      if (order.status === "paused") {
        return { success: false, message: "Subscription is already paused" }
      }

      if (order.pause_count >= 1) {
        return { success: false, message: "You can only pause once per subscription" }
      }

      if (pauseDurationDays > 21) {
        return { success: false, message: "Maximum pause duration is 3 weeks (21 days)" }
      }

      // Get deliveries that are at least 72 hours away
      const now = new Date()
      const minPauseDate = new Date(now.getTime() + 72 * 60 * 60 * 1000)

      const eligibleDeliveries = await sql`
        SELECT * FROM deliveries 
        WHERE order_id = ${orderId} 
        AND status = 'pending' 
        AND scheduled_date >= ${minPauseDate.toISOString().split("T")[0]}
        ORDER BY scheduled_date ASC
      `

      if (eligibleDeliveries.length === 0) {
        return {
          success: false,
          message: "No deliveries are eligible for pause (must be at least 72 hours ahead)",
        }
      }

      const pauseStartDate = new Date(eligibleDeliveries[0].scheduled_date)
      const resumeDate = new Date(pauseStartDate.getTime() + pauseDurationDays * 24 * 60 * 60 * 1000)

      // Update order status
      await sql`
        UPDATE orders 
        SET status = 'paused', 
            paused_at = ${now.toISOString()}, 
            pause_duration_days = ${pauseDurationDays},
            pause_count = pause_count + 1
        WHERE id = ${orderId}
      `

      // Shift all pending deliveries that fall within the pause period
      const deliveriesToShift = await sql`
        SELECT * FROM deliveries 
        WHERE order_id = ${orderId} 
        AND status = 'pending' 
        AND scheduled_date >= ${pauseStartDate.toISOString().split("T")[0]}
        ORDER BY scheduled_date ASC
      `

      for (const delivery of deliveriesToShift) {
        const originalDate = new Date(delivery.scheduled_date)
        const newDate = new Date(originalDate.getTime() + pauseDurationDays * 24 * 60 * 60 * 1000)

        await sql`
          UPDATE deliveries 
          SET scheduled_date = ${newDate.toISOString().split("T")[0]},
              updated_at = ${now.toISOString()}
          WHERE id = ${delivery.id}
        `
      }

      return {
        success: true,
        message: `Subscription paused for ${pauseDurationDays} days`,
        resumeDate: resumeDate.toISOString().split("T")[0],
      }
    } catch (error) {
      console.error("Error pausing subscription:", error)
      return { success: false, message: "Failed to pause subscription" }
    }
  }

  // Resume subscription
  static async resumeSubscription(
    orderId: number,
    resumeDate?: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const orderResult = await sql`
        SELECT * FROM orders WHERE id = ${orderId}
      `

      if (orderResult.length === 0) {
        return { success: false, message: "Order not found" }
      }

      const order = orderResult[0]

      if (order.status !== "paused") {
        return { success: false, message: "Subscription is not paused" }
      }

      // If specific resume date provided, adjust deliveries accordingly
      if (resumeDate) {
        const newResumeDate = new Date(resumeDate)
        const now = new Date()
        const minResumeDate = new Date(now.getTime() + 48 * 60 * 60 * 1000) // 48 hours notice

        if (newResumeDate < minResumeDate) {
          return {
            success: false,
            message: "Resume date must be at least 48 hours from now",
          }
        }

        // Adjust delivery schedule based on new resume date
        const pendingDeliveries = await sql`
          SELECT * FROM deliveries 
          WHERE order_id = ${orderId} 
          AND status = 'pending' 
          ORDER BY scheduled_date ASC
        `

        if (pendingDeliveries.length > 0) {
          const firstDeliveryOriginalDate = new Date(pendingDeliveries[0].scheduled_date)
          const daysDifference = Math.floor(
            (newResumeDate.getTime() - firstDeliveryOriginalDate.getTime()) / (24 * 60 * 60 * 1000),
          )

          // Shift all pending deliveries by the difference
          for (const delivery of pendingDeliveries) {
            const originalDate = new Date(delivery.scheduled_date)
            const adjustedDate = new Date(originalDate.getTime() + daysDifference * 24 * 60 * 60 * 1000)

            await sql`
              UPDATE deliveries 
              SET scheduled_date = ${adjustedDate.toISOString().split("T")[0]},
                  updated_at = ${now.toISOString()}
              WHERE id = ${delivery.id}
            `
          }
        }
      }

      // Update order status
      await sql`
        UPDATE orders 
        SET status = 'active',
            updated_at = ${new Date().toISOString()}
        WHERE id = ${orderId}
      `

      return { success: true, message: "Subscription resumed successfully" }
    } catch (error) {
      console.error("Error resuming subscription:", error)
      return { success: false, message: "Failed to resume subscription" }
    }
  }
}
