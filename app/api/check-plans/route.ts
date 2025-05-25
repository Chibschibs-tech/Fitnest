import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if meal_plans table exists and get available plans
    const plans = await sql`
      SELECT id, name, description, price 
      FROM meal_plans 
      ORDER BY id
      LIMIT 10
    `

    // Check orders table structure to see plan_id requirements
    const ordersColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND table_schema = 'public'
      ORDER BY ordinal_position
    `

    return NextResponse.json({
      availablePlans: plans,
      ordersTableStructure: ordersColumns,
      planIdColumn: ordersColumns.find((col) => col.column_name === "plan_id"),
      message: "Plan information retrieved",
    })
  } catch (error) {
    console.error("Error checking plans:", error)
    return NextResponse.json(
      {
        error: "Failed to check plans",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
