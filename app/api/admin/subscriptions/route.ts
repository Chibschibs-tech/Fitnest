import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get subscriptions with user and meal plan information
    const subscriptions = await sql`
      SELECT 
        o.id,
        u.name as "customerName",
        u.email as "customerEmail",
        mp.name as "mealPlanName",
        o.total,
        o.status,
        o.created_at as "createdAt",
        o.delivery_frequency as "deliveryFrequency",
        o.next_delivery as "nextDelivery"
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN meal_plans mp ON o.meal_plan_id = mp.id
      WHERE o.order_type = 'subscription'
      ORDER BY o.created_at DESC
    `

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}
