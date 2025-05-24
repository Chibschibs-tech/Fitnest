import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import crypto from "crypto"

// Simple hash function using built-in crypto only
function simpleHash(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + "fitnest-salt-2024")
    .digest("hex")
}

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const existingTables = tables.rows.map((row) => row.table_name)

    // Create users table if it doesn't exist
    if (!existingTables.includes("users")) {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'customer',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    }

    // Check if admin already exists
    const adminEmail = "chihab@ekwip.ma"
    const existingAdmin = await sql`SELECT id FROM users WHERE email = ${adminEmail}`

    if (existingAdmin.length > 0) {
      return NextResponse.json({
        status: "success",
        message: "Admin user already exists",
        userId: existingAdmin[0].id,
      })
    }

    // Create admin user with specified credentials
    const adminName = "Admin"
    const adminPassword = "FITnest123!"
    const hashedPassword = simpleHash(adminPassword)

    const result = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${adminName}, ${adminEmail}, ${hashedPassword}, 'admin')
      RETURNING id
    `

    return NextResponse.json({
      status: "success",
      message: "Admin user created successfully",
      userId: result[0].id,
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
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
