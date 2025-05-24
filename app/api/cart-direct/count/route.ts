import { NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

// Helper to get user ID (either from session or generate a guest ID)
function getUserId() {
  // For simplicity in v0 preview, we'll use a fixed user ID
  return "1" // Demo user ID
}

export async function GET() {
  try {
    const userId = getUserId()
    const count = mockDb.getCartItemCount(userId)

    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get cart count",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
