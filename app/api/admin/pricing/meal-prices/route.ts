import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const mealPrices = await sql`
      SELECT id, plan_name, meal_type, base_price_mad, is_active, created_at, updated_at
      FROM meal_type_prices
      ORDER BY plan_name, meal_type
    `

    return NextResponse.json({ mealPrices })
  } catch (error) {
    console.error("Error fetching meal prices:", error)
    return NextResponse.json({ error: "Failed to fetch meal prices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { plan_name, meal_type, base_price_mad } = await request.json()

    if (!plan_name || !meal_type || !base_price_mad) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO meal_type_prices (plan_name, meal_type, base_price_mad)
      VALUES (${plan_name}, ${meal_type}, ${base_price_mad})
      RETURNING *
    `

    return NextResponse.json({ mealPrice: result[0] })
  } catch (error) {
    console.error("Error creating meal price:", error)
    return NextResponse.json({ error: "Failed to create meal price" }, { status: 500 })
  }
}
