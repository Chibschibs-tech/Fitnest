export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { sql, db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    let userOrders

    if (userId && user.role === "admin") {
      userOrders = await sql`SELECT * FROM orders WHERE user_id = ${userId}`
    } else {
      userOrders = await sql`SELECT * FROM orders WHERE user_id = ${user.id}`
    }

    return NextResponse.json(userOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Handle new payload format: { client_name, client_email, client_phone, meal_plan_id, days }
    if (body.client_name && body.client_email && body.meal_plan_id && Array.isArray(body.days)) {
      const { client_name, client_email, client_phone, meal_plan_id, days } = body

      // Validate required fields
      if (!client_name || !client_email || !meal_plan_id || !days || days.length === 0) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
      }

      // Get or create user based on email
      let userId: number | null = null
      try {
        const existingUser = await sql`
          SELECT id FROM users WHERE email = ${client_email}
        `

        if (existingUser.length > 0) {
          userId = existingUser[0].id
        } else {
          // Create new user
          const newUser = await sql`
            INSERT INTO users (name, email, role)
            VALUES (${client_name}, ${client_email}, 'user')
            RETURNING id
          `
          userId = newUser[0].id
        }
      } catch (userError) {
        console.error("Error handling user:", userError)
        // Continue without user if user creation fails (guest order)
      }

      // Calculate total amount (you may want to fetch actual meal plan price)
      // For now, using a placeholder - adjust based on your pricing logic
      const totalAmount = 0 // TODO: Calculate based on meal_plan_id and days

      // Use first delivery day as delivery_date
      const deliveryDate = days[0] || new Date().toISOString()

      // Create order
      const newOrder = await sql`
        INSERT INTO orders (user_id, plan_id, total_amount, delivery_address, delivery_date, status)
        VALUES (
          ${userId}, 
          ${meal_plan_id}, 
          ${totalAmount}, 
          ${client_phone || 'N/A'}, 
          ${deliveryDate}, 
          'pending'
        )
        RETURNING *
      `

      return NextResponse.json({ id: newOrder[0].id, orderId: newOrder[0].id, ...newOrder[0] }, { status: 201 })
    }

    // Handle legacy payload format for backward compatibility
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { planId, totalAmount, deliveryAddress, deliveryDate } = body

    if (!planId || !totalAmount || !deliveryAddress || !deliveryDate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const newOrder = await sql`
      INSERT INTO orders (user_id, plan_id, total_amount, delivery_address, delivery_date, status)
      VALUES (${user.id}, ${planId}, ${totalAmount}, ${deliveryAddress}, ${deliveryDate}, 'pending')
      RETURNING *
    `

    return NextResponse.json(newOrder[0], { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
