import { type NextRequest, NextResponse } from "next/server"
import { DeliveryService } from "@/lib/delivery-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)
    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
    }

    const body = await request.json()
    const { pauseDurationDays } = body

    if (!pauseDurationDays || typeof pauseDurationDays !== "number") {
      return NextResponse.json(
        { success: false, message: "Pause duration is required and must be a number" },
        { status: 400 },
      )
    }

    const result = await DeliveryService.pauseSubscription(orderId, pauseDurationDays)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error("Error pausing subscription:", error)
    return NextResponse.json(
      { success: false, message: "Failed to pause subscription", error: String(error) },
      { status: 500 },
    )
  }
}
