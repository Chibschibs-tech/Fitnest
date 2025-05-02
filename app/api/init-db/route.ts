import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"
import { users } from "@/lib/db"

export async function GET() {
  try {
    // Check if tables exist
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)

    const existingTables = tables.rows.map((row) => row.table_name)

    // Create a simple test user if users table exists but is empty
    if (existingTables.includes("users")) {
      const userCount = await db.select({ count: sql`count(*)` }).from(users)

      if (userCount[0].count === 0) {
        await db.insert(users).values({
          name: "Test User",
          email: "test@fitnest.ma",
          password: "$2a$10$8r5tFBqUGi32Uu7vxMIIyuHFXcxALMFTmqXX3LJcH.z7xHLxHzp1e", // password: password123
          role: "admin",
        })
      }
    }

    return NextResponse.json({
      status: "success",
      message: "Database check completed",
      existingTables,
      tablesCount: existingTables.length,
    })
  } catch (error) {
    console.error("Database initialization failed:", error)
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
