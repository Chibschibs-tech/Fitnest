import { type NextRequest, NextResponse } from "next/server"
import {
  getAuthenticatedUserId,
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  ensureCartTable,
} from "@/lib/db-utils"

// GET handler to fetch cart items
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user ID
    const userId = await getAuthenticatedUserId()

    // Ensure cart table exists
    await ensureCartTable()

    // Get cart items
    const cartItems = await getCartItems(userId)

    // Calculate totals
    const itemCount = cartItems.length
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.product?.salePrice || item.product?.price || 0
      return sum + price * item.quantity
    }, 0)

    return NextResponse.json({
      success: true,
      items: cartItems,
      itemCount,
      subtotal,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 })
  }
}

// POST handler to add item to cart
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user ID
    const userId = await getAuthenticatedUserId()

    // Parse request body
    const body = await request.json()
    const { productId, quantity } = body

    // Validate input
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ success: false, error: "Invalid product ID or quantity" }, { status: 400 })
    }

    // Add to cart
    const result = await addToCart(userId, productId, quantity)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 })
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ success: false, error: "Failed to add item to cart" }, { status: 500 })
  }
}

// DELETE handler to remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user ID
    const userId = await getAuthenticatedUserId()

    // Get item ID from query params
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("id")
    const clearAll = searchParams.get("clearAll")

    if (clearAll === "true") {
      // Clear entire cart
      const result = await clearCart(userId)

      return NextResponse.json(result)
    } else if (itemId) {
      // Remove specific item
      const result = await removeFromCart(userId, Number.parseInt(itemId))

      if (result.success) {
        return NextResponse.json(result)
      } else {
        return NextResponse.json({ success: false, error: result.message }, { status: 400 })
      }
    } else {
      return NextResponse.json({ success: false, error: "Missing item ID" }, { status: 400 })
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ success: false, error: "Failed to remove item from cart" }, { status: 500 })
  }
}

// PUT handler to update cart item quantity
export async function PUT(request: NextRequest) {
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

    // Update cart item
    const result = await updateCartItemQuantity(userId, itemId, quantity)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 })
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ success: false, error: "Failed to update cart item" }, { status: 500 })
  }
}
