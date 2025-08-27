import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { plan_name, meal_type, base_price_mad, is_active } = await request.json()
    const id = Number.parseInt(params.id)

    const result = await sql`
      UPDATE meal_type_prices 
      SET plan_name = ${plan_name}, 
          meal_type = ${meal_type}, 
          base_price_mad = ${base_price_mad},
          is_active = ${is_active}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Meal price not found" }, { status: 404 })
    }

    return NextResponse.json({ mealPrice: result[0] })
  } catch (error) {
    console.error("Error updating meal price:", error)
    return NextResponse.json({ error: "Failed to update meal price" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const result = await sql`
      DELETE FROM meal_type_prices WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Meal price not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting meal price:", error)
    return NextResponse.json({ error: "Failed to delete meal price" }, { status: 500 })
  }
}
