import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"

const sql = neon(process.env.DATABASE_URL!)

const UpdateDiscountRuleSchema = z.object({
  discount_type: z.enum(["duration_weeks", "days_per_week", "special_offer"]).optional(),
  condition_value: z.number().min(1, "Condition value must be positive").optional(),
  discount_percentage: z.number().min(0).max(1, "Discount must be between 0 and 1").optional(),
  stackable: z.boolean().optional(),
  is_active: z.boolean().optional(),
  valid_from: z.string().optional(),
  valid_to: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const result = await sql`
      SELECT id, discount_type, condition_value, discount_percentage, stackable, is_active,
             valid_from, valid_to, created_at, updated_at
      FROM discount_rules
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Discount rule not found" }, { status: 404 })
    }

    return NextResponse.json({ discountRule: result[0] })
  } catch (error) {
    console.error("Error fetching discount rule:", error)
    return NextResponse.json({ error: "Failed to fetch discount rule" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const body = await request.json()
    const validation = UpdateDiscountRuleSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.errors }, { status: 400 })
    }

    const updates = validation.data

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const result = await sql`
      UPDATE discount_rules 
      SET ${sql(updates)}
      WHERE id = ${id}
      RETURNING id, discount_type, condition_value, discount_percentage, stackable, is_active,
                valid_from, valid_to, created_at, updated_at
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Discount rule not found" }, { status: 404 })
    }

    return NextResponse.json({ discountRule: result[0] })
  } catch (error) {
    console.error("Error updating discount rule:", error)
    return NextResponse.json({ error: "Failed to update discount rule" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM discount_rules
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Discount rule not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Discount rule deleted successfully" })
  } catch (error) {
    console.error("Error deleting discount rule:", error)
    return NextResponse.json({ error: "Failed to delete discount rule" }, { status: 500 })
  }
}
