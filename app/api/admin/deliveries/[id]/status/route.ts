import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is authenticated and is admin
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()
    const deliveryId = params.id

    // Update delivery status by updating the corresponding order
    const orderStatus = status === "delivered" ? "delivered" : status === "in_transit" ? "processing" : "confirmed"

    await sql`
      UPDATE orders 
      SET status = ${orderStatus}
      WHERE id = ${deliveryId}
    `

    return NextResponse.json({
      success: true,
      message: "Delivery status updated successfully",
    })
  } catch (error) {
    console.error("Error updating delivery status:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update delivery status",
      },
      { status: 500 },
    )
  }
}
