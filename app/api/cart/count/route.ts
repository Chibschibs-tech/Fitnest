import { NextResponse } from "next/server"
import { db, cartItems } from "@/lib/db"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 })
    }

    const userId = Number.parseInt(session.user.id as string)

    // Count cart items for the user
    const result = await db.select({ count: db.fn.count() }).from(cartItems).where(eq(cartItems.userId, userId))

    const count = Number(result[0]?.count || 0)

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching cart count:", error)
    return NextResponse.json({ count: 0 })
  }
}
