import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUserId, getCartCount } from "@/lib/db-utils"

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user ID
    const userId = await getAuthenticatedUserId()

    // Get cart count
    const count = await getCartCount(userId)

    return NextResponse.json({
      success: true,
      count,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ success: false, error: "Not authenticated", count: 0 }, { status: 401 })
    }

    return NextResponse.json({ success: false, error: "Failed to get cart count", count: 0 }, { status: 500 })
  }
}
