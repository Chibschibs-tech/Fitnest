import { type NextRequest, NextResponse } from "next/server"
import { db, cartItems, products } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Helper function to get user ID from session
async function getUserId() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }
  return Number.parseInt(session.user.id as string)
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()

    // Get all cart items for the user with product details
    const userCart = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        product: products,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId))

    // Calculate totals
    const subtotal = userCart.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price
      return sum + price * item.quantity
    }, 0)

    return NextResponse.json({
      items: userCart,
      subtotal,
      itemCount: userCart.length,
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    if (error instanceof Error && error.message === "User not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    const data = await request.json()

    // Validate required fields
    if (!data.productId || !data.quantity) {
      return NextResponse.json(
        { error: "Missing required fields: productId and quantity are required" },
        { status: 400 },
      )
    }

    // Check if product exists and is active
    const productExists = await db
      .select()
      .from(products)
      .where(and(eq(products.id, data.productId), eq(products.isActive, true)))
      .limit(1)

    if (productExists.length === 0) {
      return NextResponse.json({ error: "Product not found or inactive" }, { status: 404 })
    }

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, data.productId)))
      .limit(1)

    let result

    if (existingItem.length > 0) {
      // Update quantity if item already exists
      result = await db
        .update(cartItems)
        .set({
          quantity: data.quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning()
    } else {
      // Add new item to cart
      result = await db
        .insert(cartItems)
        .values({
          userId,
          productId: data.productId,
          quantity: data.quantity,
        })
        .returning()
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error updating cart:", error)
    if (error instanceof Error && error.message === "User not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId()
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("id")
    const clearAll = searchParams.get("clearAll")

    if (clearAll === "true") {
      // Clear entire cart
      await db.delete(cartItems).where(eq(cartItems.userId, userId))
      return NextResponse.json({ message: "Cart cleared successfully" })
    } else if (itemId) {
      // Delete specific item
      const result = await db
        .delete(cartItems)
        .where(and(eq(cartItems.id, Number.parseInt(itemId)), eq(cartItems.userId, userId)))
        .returning()

      if (result.length === 0) {
        return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
      }

      return NextResponse.json({ message: "Item removed from cart" })
    } else {
      return NextResponse.json({ error: "Missing item ID or clearAll parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error removing from cart:", error)
    if (error instanceof Error && error.message === "User not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
