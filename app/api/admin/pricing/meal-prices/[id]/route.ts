import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"

const sql = neon(process.env.DATABASE_URL!)

const UpdateMealPriceSchema = z.object({
  plan_name: z.string().min(1, "Plan name is required").optional(),
  meal_type: z.string().min(1, "Meal type is required").optional(),
  base_price_mad: z.number().min(0, "Price must be positive").optional(),
  is_active: z.boolean().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const result = await sql`
      SELECT id, plan_name, meal_type, base_price_mad, is_active, created_at, updated_at
      FROM meal_type_prices
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Meal price not found" }, { status: 404 })
    }

    return NextResponse.json({ mealPrice: result[0] })
  } catch (error) {
    console.error("Error fetching meal price:", error)
    return NextResponse.json({ error: "Failed to fetch meal price" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const body = await request.json()
    const validation = UpdateMealPriceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.errors }, { status: 400 })
    }

    const updates = validation.data
    const updateFields = Object.keys(updates)
      .map((key) => `${key} = $${key}`)
      .join(", ")

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const result = await sql`
      UPDATE meal_type_prices 
      SET ${sql(updates)}
      WHERE id = ${id}
      RETURNING id, plan_name, meal_type, base_price_mad, is_active, created_at, updated_at
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Meal price not found" }, { status: 404 })
    }

    return NextResponse.json({ mealPrice: result[0] })
  } catch (error: any) {
    console.error("Error updating meal price:", error)

    if (error.code === "23505") {
      return NextResponse.json({ error: "Meal price for this plan and meal type already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to update meal price" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM meal_type_prices
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Meal price not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Meal price deleted successfully" })
  } catch (error) {
    console.error("Error deleting meal price:", error)
    return NextResponse.json({ error: "Failed to delete meal price" }, { status: 500 })
  }
}
