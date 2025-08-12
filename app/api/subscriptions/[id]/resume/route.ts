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

    const body = await request.json()
    const { resumeDate } = body
    const orderId = Number.parseInt(params.id)

    const result = await DeliveryService.resumeSubscription(orderId, resumeDate)

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error("Error resuming subscription:", error)
    return NextResponse.json({ message: "Failed to resume subscription" }, { status: 500 })
  }
}
