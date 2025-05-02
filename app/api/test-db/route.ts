import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

export async function GET() {
  try {
    // Simple query to test database connection
    const result = await db.execute(sql`SELECT 1 as test`)

    // Try to count users
    const userCount = await db.select({ count: sql`count(*)` }).from(sql`information_schema.tables`)

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      test: result,
      tableCount: userCount.length,
      tables: userCount,
    })
  } catch (error) {
    console.error("Database test failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
