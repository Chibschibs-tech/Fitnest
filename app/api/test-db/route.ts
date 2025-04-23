import { NextResponse } from "next/server"
import { db, users } from "@/lib/db"
import { sql } from "drizzle-orm"

export async function GET() {
  try {
    // Simple query to test database connection
    const result = await db.execute(sql`SELECT 1 as test`)

    // Try to count users
    const userCount = await db.select({ count: sql`count(*)` }).from(users)

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      test: result,
      userCount: userCount[0]?.count || 0,
    })
  } catch (error) {
    console.error("Database test failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
