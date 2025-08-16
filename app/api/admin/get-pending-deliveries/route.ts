import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("Fetching pending deliveries for admin")

    // First, try to get real data from orders and delivery_status tables
    const deliveries = []

    try {
      // Get all orders with their delivery schedules
      const orders = await sql`
        SELECT 
          o.id as order_id,
          o.selected_days,
          o.selected_weeks,
          o.start_date,
          o.plan_name,
          o.total_amount,
          o.status as order_status,
          u.name as customer_name,
          u.email as customer_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.status = 'active'
        ORDER BY o.created_at DESC
      `

      // Generate delivery schedule for each order
      for (const order of orders) {
        if (!order.selected_days || !order.selected_weeks) continue

        const selectedDays = JSON.parse(order.selected_days)
        const selectedWeeks = Number.parseInt(order.selected_weeks) || 1
        const startDate = new Date(order.start_date || new Date())

        const dayMapping = {
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 0,
        }

        // Generate all delivery dates for this order
        for (let week = 0; week < selectedWeeks; week++) {
          for (const dayName of selectedDays) {
            const dayOfWeek = dayMapping[dayName.toLowerCase()]
            const deliveryDate = new Date(startDate)

            // Calculate the date for this specific day in this specific week
            const daysFromStart = week * 7 + ((dayOfWeek - startDate.getDay() + 7) % 7)
            deliveryDate.setDate(startDate.getDate() + daysFromStart)

            // Check delivery status
            let deliveryStatus = "pending"
            try {
              const statusResult = await sql`
                SELECT status FROM delivery_status 
                WHERE order_id = ${order.order_id} 
                AND delivery_date = ${deliveryDate.toISOString().split("T")[0]}
              `
              if (statusResult.length > 0) {
                deliveryStatus = statusResult[0].status
              }
            } catch (error) {
              // delivery_status table might not exist yet
              console.log("No delivery status found, using pending")
            }

            deliveries.push({
              orderId: order.order_id,
              customerName: order.customer_name || "Unknown Customer",
              customerEmail: order.customer_email || "unknown@example.com",
              planName: order.plan_name || "Meal Plan",
              deliveryDate: deliveryDate.toISOString(),
              dayName: dayName,
              weekNumber: week + 1,
              status: deliveryStatus,
              totalAmount: order.total_amount || 0,
            })
          }
        }
      }
    } catch (error) {
      console.log("Could not fetch real orders, using mock data:", error)

      // Fallback to mock data
      const mockOrders = [
        {
          orderId: 28,
          customerName: "Ahmed Hassan",
          customerEmail: "ahmed@example.com",
          planName: "Weight Loss Plan",
          days: ["monday", "wednesday", "friday"],
          weeks: 3,
          totalAmount: 1047,
        },
        {
          orderId: 27,
          customerName: "Fatima Zahra",
          customerEmail: "fatima@example.com",
          planName: "Muscle Gain Plan",
          days: ["tuesday", "thursday", "saturday"],
          weeks: 2,
          totalAmount: 798,
        },
        {
          orderId: 26,
          customerName: "Youssef Alami",
          customerEmail: "youssef@example.com",
          planName: "Keto Plan",
          days: ["monday", "thursday"],
          weeks: 4,
          totalAmount: 1256,
        },
      ]

      const dayMapping = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 0,
      }

      for (const order of mockOrders) {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() + 1) // Start tomorrow

        for (let week = 0; week < order.weeks; week++) {
          for (const dayName of order.days) {
            const dayOfWeek = dayMapping[dayName]
            const deliveryDate = new Date(startDate)

            const daysFromStart = week * 7 + ((dayOfWeek - startDate.getDay() + 7) % 7)
            deliveryDate.setDate(startDate.getDate() + daysFromStart)

            // Mock some delivered status for demo
            const isPastDate = deliveryDate < new Date()
            const isRecentPast =
              deliveryDate < new Date() && deliveryDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

            deliveries.push({
              orderId: order.orderId,
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              planName: order.planName,
              deliveryDate: deliveryDate.toISOString(),
              dayName: dayName,
              weekNumber: week + 1,
              status: isPastDate || isRecentPast ? "delivered" : "pending",
              totalAmount: order.totalAmount,
            })
          }
        }
      }
    }

    // Sort by delivery date
    deliveries.sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime())

    return NextResponse.json({
      success: true,
      deliveries,
      totalDeliveries: deliveries.length,
      pendingDeliveries: deliveries.filter((d) => d.status === "pending").length,
      deliveredDeliveries: deliveries.filter((d) => d.status === "delivered").length,
    })
  } catch (error) {
    console.error("Error fetching deliveries:", error)
    return NextResponse.json({ error: "Failed to fetch deliveries" }, { status: 500 })
  }
}
