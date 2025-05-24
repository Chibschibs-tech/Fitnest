import { type NextRequest, NextResponse } from "next/server"
import { mockDb, getCurrentUser } from "@/lib/mock-db"

export async function GET() {
  try {
    const user = getCurrentUser()
    const items = await mockDb.getCartItems(user.id)

    return NextResponse.json({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser()
    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Check if product exists
    const product = await mockDb.getProduct(Number.parseInt(productId))
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const cartItem = await mockDb.addToCart(user.id, Number.parseInt(productId), quantity)

    return NextResponse.json({
      success: true,
      item: cartItem,
      message: "Item added to cart",
    })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json()

    if (!itemId || quantity === undefined) {
      return NextResponse.json({ error: "Item ID and quantity are required" }, { status: 400 })
    }

    const success = await mockDb.updateCartItem(itemId, quantity)

    if (!success) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
    })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const itemId = url.searchParams.get("id")
    const clearAll = url.searchParams.get("clearAll")
    const user = getCurrentUser()

    if (clearAll === "true") {
      const success = await mockDb.clearCart(user.id)
      return NextResponse.json({
        success,
        message: "Cart cleared successfully",
      })
    }

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const success = await mockDb.removeCartItem(Number.parseInt(itemId))

    if (!success) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 })
  }
}
