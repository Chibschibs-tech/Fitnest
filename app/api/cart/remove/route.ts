import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user ID
    const userId = session.user.id

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 })
    }

    // Parse form data
    const formData = await request.formData()
    const itemId = formData.get("itemId")

    // Validate input
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    // Initialize Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Delete the cart item
    const result = await sql`
      DELETE FROM cart_items
      WHERE id = ${itemId} AND user_id = ${userId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    // Redirect back to cart page
    return NextResponse.redirect(new URL("/cart", request.url))
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json(
      {
        error: "Failed to remove item from cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
