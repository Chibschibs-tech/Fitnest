import { NextResponse } from "next/server"
import { sql } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Test database connection
    const connectionTest = await sql`SELECT 1 as connection_test`

    // Get database version
    const versionInfo = await sql`SELECT version()`

    // Check for existing tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Get database user and permissions
    const currentUser = await sql`SELECT current_user, current_database()`

    // Check if we can create a test table
    let canCreateTable = false
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS _test_permissions (
          id SERIAL PRIMARY KEY,
          test_column TEXT
        )
      `
      await sql`DROP TABLE IF EXISTS _test_permissions`
      canCreateTable = true
    } catch (error) {
      console.error("Permission test failed:", error)
    }

    return NextResponse.json({
      status: "Database connection successful",
      connection: connectionTest.rows[0],
      version: versionInfo.rows[0].version,
      tables: tables.rows.map((row) => row.table_name),
      user: currentUser.rows[0],
      permissions: {
        canCreateTable,
      },
    })
  } catch (error) {
    console.error("Database check failed:", error)
    return NextResponse.json(
      {
        status: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
