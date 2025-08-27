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

    // Check which tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('subscription_plans', 'subscription_plan_items', 'active_subscriptions', 'deliveries', 'products', 'users')
      ORDER BY table_name
    `

    // Check products table structure to see what columns exist
    const productsColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'products'
      ORDER BY ordinal_position
    `

    // Get sample products to see the data structure
    const sampleProducts = await sql`
      SELECT * FROM products LIMIT 3
    `

    // Check if subscription tables exist and get their row counts
    const tableStats = {}
    const existingTables = tables.map((t) => t.table_name)

    for (const tableName of ["subscription_plans", "subscription_plan_items", "active_subscriptions", "deliveries"]) {
      if (existingTables.includes(tableName)) {
        try {
          const count = await sql`SELECT COUNT(*) as count FROM ${sql(tableName)}`
          tableStats[tableName] = {
            exists: true,
            count: Number.parseInt(count[0].count),
          }
        } catch (error) {
          tableStats[tableName] = {
            exists: true,
            count: "Error getting count",
            error: error instanceof Error ? error.message : "Unknown error",
          }
        }
      } else {
        tableStats[tableName] = {
          exists: false,
          count: 0,
        }
      }
    }

    return NextResponse.json({
      success: true,
      tables: existingTables,
      tableStats,
      productsColumns: productsColumns.map((col) => ({
        name: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable === "YES",
      })),
      sampleProducts: sampleProducts.length > 0 ? sampleProducts[0] : null,
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
