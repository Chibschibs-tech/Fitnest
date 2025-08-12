import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { DeliveryService } from "@/lib/delivery-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const orderId = Number.parseInt(params.id)
    const deliverySchedule = await DeliveryService.getDeliverySchedule(orderId)

    return NextResponse.json(deliverySchedule)
  } catch (error) {
    console.error("Error fetching delivery schedule:", error)
    return NextResponse.json({ message: "Failed to fetch delivery schedule" }, { status: 500 })
  }
}
