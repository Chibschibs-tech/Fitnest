import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { DeliveryService } from "@/lib/delivery-service"

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    const { pauseDurationDays } = await request.json()
    const orderId = Number.parseInt(params.id)

    if (!pauseDurationDays || pauseDurationDays < 1 || pauseDurationDays > 21) {
      return NextResponse.json({ message: "Pause duration must be between 1 and 21 days" }, { status: 400 })
    }

    const result = await DeliveryService.pauseSubscription(orderId, pauseDurationDays)

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      resumeDate: result.resumeDate,
    })
  } catch (error) {
    console.error("Error pausing subscription:", error)
    return NextResponse.json({ message: "Failed to pause subscription" }, { status: 500 })
  }
}
