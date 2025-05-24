import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

// Simple hash function using built-in crypto
function simpleHash(password: string): string {
  // Use a simple hash for demo purposes - in production you'd want something stronger
  const crypto = require("crypto")
  return crypto
    .createHash("sha256")
    .update(password + "salt")
    .digest("hex")
}

export async function initTables() {
  try {
    // Create users table
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

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("Tables initialized successfully")
  } catch (error) {
    console.error("Error initializing tables:", error)
  }
}

export async function createUser(name: string, email: string, password: string) {
  try {
    const hashedPassword = simpleHash(password)

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
    const hashedPassword = simpleHash(password)

    const result = await sql`
      SELECT id, name, email, role
      FROM users
      WHERE email = ${email} AND password = ${hashedPassword}
    `

    return result[0] || null
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

export async function createSession(userId: number) {
  try {
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await sql`
      INSERT INTO user_sessions (id, user_id, expires_at)
      VALUES (${sessionId}, ${userId}, ${expiresAt})
    `

    return sessionId
  } catch (error) {
    console.error("Error creating session:", error)
    return null
  }
}

export async function getSessionUser(sessionId: string) {
  try {
    const result = await sql`
      SELECT u.id, u.name, u.email, u.role
      FROM users u
      JOIN user_sessions s ON u.id = s.user_id
      WHERE s.id = ${sessionId} AND s.expires_at > NOW()
    `

    return result[0] || null
  } catch (error) {
    console.error("Error getting session user:", error)
    return null
  }
}

export async function deleteSession(sessionId: string) {
  try {
    await sql`DELETE FROM user_sessions WHERE id = ${sessionId}`
  } catch (error) {
    console.error("Error deleting session:", error)
  }
}
