import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { db, orders } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    let userOrders

    if (userId) {
      userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, Number.parseInt(userId)))
    } else {
      userOrders = await db.select().from(orders)
    }

    return NextResponse.json(userOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { planId, totalAmount, deliveryAddress, deliveryDate } = await request.json()

    // Validate input
    if (!planId || !totalAmount || !deliveryAddress || !deliveryDate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const userId = Number.parseInt(session.user.id as string)

    // Create order
    const newOrder = await db
      .insert(orders)
      .values({
        userId,
        planId,
        totalAmount,
        deliveryAddress,
        deliveryDate: new Date(deliveryDate),
        status: "pending",
      })
      .returning()

    return NextResponse.json(newOrder[0], { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
