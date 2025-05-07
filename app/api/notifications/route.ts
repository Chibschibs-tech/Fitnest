import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { db, notifications } from "@/lib/db"
import { eq, and } from "drizzle-orm"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)

    // Get user's notifications
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy({ createdAt: "desc" })
      .limit(20)

    return NextResponse.json(userNotifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { userId, title, description, type } = await request.json()

    // Validate input
    if (!userId || !title || !description || !type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create notification
    const newNotification = await db
      .insert(notifications)
      .values({
        userId,
        title,
        description,
        type,
      })
      .returning()

    return NextResponse.json(newNotification[0], { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const { notificationId, isRead } = await request.json()

    // Validate input
    if (!notificationId) {
      return NextResponse.json({ message: "Missing notification ID" }, { status: 400 })
    }

    // Update notification
    await db
      .update(notifications)
      .set({ isRead: isRead === undefined ? true : isRead })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))

    return NextResponse.json({ message: "Notification updated" })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
