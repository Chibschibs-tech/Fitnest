import { NextResponse } from "next/server"
import { getAuthenticatedUserId, updateCartItemQuantity } from "@/lib/db-utils"

export async function POST(request: Request) {
  try {
    // Get authenticated user ID
    const userId = await getAuthenticatedUserId()

    // Parse request body
    const body = await request.json()
    const { itemId, quantity } = body

    // Validate input
    if (!itemId || !quantity || quantity < 1) {
      return NextResponse.json({ success: false, error: "Invalid item ID or quantity" }, { status: 400 })
    }

    // Update cart item quantity
    const result = await updateCartItemQuantity(userId, itemId, quantity)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      })
    } else {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in cart/update API:", error)

    // Check if error is authentication related
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update cart item",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
