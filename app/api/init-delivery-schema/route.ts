import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Read the SQL file
    const schemaPath = path.join(process.cwd(), "scripts", "add-pause-delivery-schema.sql")
    const schemaSQL = fs.readFileSync(schemaPath, "utf8")

    // Execute the SQL
    await sql.query(schemaSQL)

    return NextResponse.json({ success: true, message: "Delivery schema initialized successfully" })
  } catch (error) {
    console.error("Error initializing delivery schema:", error)
    return NextResponse.json(
      { success: false, message: "Failed to initialize delivery schema", error: String(error) },
      { status: 500 },
    )
  }
}
