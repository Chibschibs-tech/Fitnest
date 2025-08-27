import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { discount_type, condition_value, discount_percentage, stackable, is_active, valid_from, valid_to } =
      await request.json()
    const id = Number.parseInt(params.id)

    const result = await sql`
      UPDATE discount_rules 
      SET discount_type = ${discount_type}, 
          condition_value = ${condition_value}, 
          discount_percentage = ${discount_percentage},
          stackable = ${stackable},
          is_active = ${is_active},
          valid_from = ${valid_from || null},
          valid_to = ${valid_to || null}
      WHERE id = ${id}
      RETURNING *
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

    const result = await sql`
      DELETE FROM discount_rules WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Discount rule not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting discount rule:", error)
    return NextResponse.json({ error: "Failed to delete discount rule" }, { status: 500 })
  }
}
