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

    // Check if tables exist - handle different response formats
    let tables
    try {
      tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
    } catch (error) {
      console.log("Error checking tables, will create users table:", error)
      tables = []
    }

    // Handle different response formats from Neon
    let existingTables = []
    if (Array.isArray(tables)) {
      existingTables = tables.map((row) => row.table_name)
    } else if (tables && tables.rows && Array.isArray(tables.rows)) {
      existingTables = tables.rows.map((row) => row.table_name)
    }

    console.log("Existing tables:", existingTables)

    // Create users table if it doesn't exist
    if (!existingTables.includes("users")) {
      console.log("Creating users table...")
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
      console.log("Users table created")
    }

    // Check if admin already exists
    const adminEmail = "chihab@ekwip.ma"
    let existingAdmin
    try {
      existingAdmin = await sql`SELECT id FROM users WHERE email = ${adminEmail}`
    } catch (error) {
      console.log("Error checking existing admin:", error)
      existingAdmin = []
    }

    // Handle different response formats
    const adminExists = Array.isArray(existingAdmin) ? existingAdmin.length > 0 : false

    if (adminExists) {
      const adminId = Array.isArray(existingAdmin) ? existingAdmin[0].id : existingAdmin.id
      return NextResponse.json({
        status: "success",
        message: "Admin user already exists",
        userId: adminId,
      })
    }

    // Create admin user with specified credentials
    const adminName = "Admin"
    const adminPassword = "FITnest123!"
    const hashedPassword = simpleHash(adminPassword)

    console.log("Creating admin user...")
    const result = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${adminName}, ${adminEmail}, ${hashedPassword}, 'admin')
      RETURNING id
    `

    console.log("Admin user created, result:", result)

    // Handle different response formats
    const userId = Array.isArray(result) ? result[0].id : result.id

    return NextResponse.json({
      status: "success",
      message: "Admin user created successfully",
      userId: userId,
      debug: {
        tablesFound: existingTables.length,
        adminEmail: adminEmail,
      },
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        debug: {
          errorType: typeof error,
          errorConstructor: error?.constructor?.name,
        },
      },
      { status: 500 },
    )
  }
}
