import { type NextRequest, NextResponse } from "next/server"
import { DeliveryService } from "@/lib/delivery-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)

    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
    }

    const deliverySchedule = await DeliveryService.getDeliverySchedule(orderId)

    return NextResponse.json({
      success: true,
      ...deliverySchedule,
    })
  } catch (error) {
    console.error("Error getting delivery schedule:", error)
    return NextResponse.json({ success: false, message: "Failed to get delivery schedule" }, { status: 500 })
  }
}
