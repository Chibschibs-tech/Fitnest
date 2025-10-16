import { NextResponse } from "next/server"
import { sql, db } from "@/lib/db"

export async function GET() {
  try {
    // Initialize the Neon SQL client
    `

    // Get the table structure if it exists
    let tableStructure = []
    if (tableExists[0].exists) {
      tableStructure = await sql`
        SELECT column_name, data_type, column_default
        FROM information_schema.columns
        WHERE table_name = 'cart_items'
        ORDER BY ordinal_position
      `
    }

    // Get a sample row to see the actual data
    let sampleData = []
    if (tableExists[0].exists) {
      sampleData = await sql`
        SELECT *
        FROM cart_items
        LIMIT 1
      `
    }

    return NextResponse.json({
      tableExists: tableExists[0].exists,
      tableStructure,
      sampleData: sampleData.length > 0 ? sampleData[0] : null,
      columnNames: tableStructure.map((col: any) => col.column_name),
    })
  } catch (error) {
    console.error("Error checking cart_items table:", error)
    return NextResponse.json(
      {
        error: "Failed to check cart_items table",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
