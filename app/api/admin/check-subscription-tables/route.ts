import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if subscription tables exist
    const tablesCheck = await sql`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name IN ('subscription_plans', 'subscription_plan_items', 'active_subscriptions', 'deliveries')
      ORDER BY table_name, ordinal_position
    `

    const tableStructure: Record<string, any[]> = {}
    tablesCheck.forEach((row) => {
      if (!tableStructure[row.table_name]) {
        tableStructure[row.table_name] = []
      }
      tableStructure[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
      })
    })

    const requiredTables = ["subscription_plans", "subscription_plan_items", "active_subscriptions", "deliveries"]
    const existingTables = Object.keys(tableStructure)
    const missingTables = requiredTables.filter((table) => !existingTables.includes(table))

    // Check for existing data
    const dataCount = {}
    for (const table of existingTables) {
      try {
        const count = await sql`SELECT COUNT(*) as count FROM ${sql(table)}`
        dataCount[table] = Number.parseInt(count[0].count)
      } catch (error) {
        dataCount[table] = "Error"
      }
    }

    return NextResponse.json({
      success: true,
      tableStructure,
      existingTables,
      missingTables,
      dataCount,
      allTablesExist: missingTables.length === 0,
    })
  } catch (error) {
    console.error("Check subscription tables error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
