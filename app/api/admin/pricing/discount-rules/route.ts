import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const discountRules = await sql`
      SELECT id, discount_type, condition_value, discount_percentage, stackable, is_active, valid_from, valid_to, created_at, updated_at
      FROM discount_rules
      ORDER BY discount_type, condition_value
    `

    return NextResponse.json({ discountRules })
  } catch (error) {
    console.error("Error fetching discount rules:", error)
    return NextResponse.json({ error: "Failed to fetch discount rules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { discount_type, condition_value, discount_percentage, stackable, valid_from, valid_to } =
      await request.json()

    if (!discount_type || !condition_value || !discount_percentage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO discount_rules (discount_type, condition_value, discount_percentage, stackable, valid_from, valid_to)
      VALUES (${discount_type}, ${condition_value}, ${discount_percentage}, ${stackable || true}, ${valid_from || null}, ${valid_to || null})
      RETURNING *
    `

    return NextResponse.json({ discountRule: result[0] })
  } catch (error) {
    console.error("Error creating discount rule:", error)
    return NextResponse.json({ error: "Failed to create discount rule" }, { status: 500 })
  }
}
