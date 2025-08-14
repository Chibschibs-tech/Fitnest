import { type NextRequest, NextResponse } from "next/server"
import { DeliveryService } from "@/lib/delivery-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, startDate, totalWeeks, deliveryDays } = body

    if (!orderId || !startDate) {
      return NextResponse.json({ success: false, message: "Order ID and start date are required" }, { status: 400 })
    }

    await DeliveryService.generateDeliverySchedule(
      orderId,
      new Date(startDate),
      totalWeeks || 4,
      deliveryDays || ["monday", "tuesday", "wednesday", "thursday", "friday"],
    )

    return NextResponse.json({
      success: true,
      message: `Successfully generated delivery schedule for order ${orderId}`,
    })
  } catch (error) {
    console.error("Error generating delivery schedule:", error)
    return NextResponse.json(
      { success: false, message: "Failed to generate delivery schedule", error: String(error) },
      { status: 500 },
    )
  }
}
