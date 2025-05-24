import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

// Simple hash function using built-in crypto only
function simpleHash(password: string): string {
  // Use built-in Node.js crypto module
  const crypto = require("crypto")
  return crypto
    .createHash("sha256")
    .update(password + "fitnest-salt-2024")
    .digest("hex")
}

export async function hashPassword(password: string): Promise<string> {
  return simpleHash(password)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return simpleHash(password) === hashedPassword
}

export async function createUser(name: string, email: string, password: string) {
  try {
    const hashedPassword = await hashPassword(password)

    const result = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, 'user')
      RETURNING id, name, email, role
    `

    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const result = await sql`
      SELECT id, name, email, password, role
      FROM users
      WHERE email = ${email}
    `

    const user = result[0]
    if (!user) return null

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) return null

    // Return user without password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

export async function getUserById(id: number) {
  try {
    const result = await sql`
      SELECT id, name, email, role
      FROM users
      WHERE id = ${id}
    `

    return result[0] || null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export async function initAuthTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("Auth tables initialized successfully")
  } catch (error) {
    console.error("Error initializing auth tables:", error)
  }
}
