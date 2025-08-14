import { NextResponse } from "next/server"
import { DeliveryService } from "@/lib/delivery-service"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)
    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
    }

    const deliverySchedule = await DeliveryService.getDeliverySchedule(orderId)
    return NextResponse.json(deliverySchedule)
  } catch (error) {
    console.error("Error fetching delivery schedule:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch delivery schedule", error: String(error) },
      { status: 500 },
    )
  }
}
