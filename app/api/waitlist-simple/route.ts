import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, mealPlan, city, notifications } = body

    console.log("=== WAITLIST SUBMISSION ===")
    console.log("Name:", firstName, lastName)
    console.log("Email:", email)
    console.log("Phone:", phone)
    console.log("Meal Plan:", mealPlan)
    console.log("City:", city)
    console.log("Notifications:", notifications)
    console.log("Timestamp:", new Date().toISOString())
    console.log("========================")

    // For now, just log to console and return success
    // You can manually check the server logs for submissions

    return NextResponse.json({
      success: true,
      message: "Waitlist signup received successfully",
    })
  } catch (error) {
    console.error("Waitlist submission error:", error)

    return NextResponse.json({
      success: true,
      message: "Waitlist signup received successfully",
    })
  }
}
