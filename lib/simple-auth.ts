import { neon } from "@neondatabase/serverless"
import crypto from "crypto"
import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/jwt"

const sql = neon(process.env.DATABASE_URL!)

// Simple hash function using built-in crypto only
function simpleHash(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + "fitnest-salt-2024")
    .digest("hex")
}

export async function initTables() {
  try {
    // Create users table if it doesn't exist
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

    // Create sessions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("Tables initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing tables:", error)
    return false
  }
}

export async function createUser(name: string, email: string, password: string) {
  try {
    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUser.length > 0) {
      return null
    }

    // Hash password with crypto
    const hashedPassword = simpleHash(password)

    // Create user
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
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
    // Get user
    const users = await sql`SELECT * FROM users WHERE email = ${email}`
    const user = users[0]

    if (!user) {
      console.log("User not found:", email)
      return null
    }

    // Verify password
    const hashedPassword = simpleHash(password)
    if (hashedPassword !== user.password) {
      console.log("Password mismatch for user:", email)
      return null
    }

    console.log("User authenticated successfully:", email)
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

export async function createSession(userId: number) {
  try {
    console.log("Creating session for user ID:", userId)

    // Ensure sessions table exists
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    const sessionId = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    console.log("Session details:", { sessionId, userId, expiresAt })

    const result = await sql`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (${sessionId}, ${userId}, ${expiresAt})
      RETURNING id
    `

    console.log("Session created successfully:", result)
    return sessionId
  } catch (error) {
    console.error("Error creating session:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      userId,
    })
    return null
  }
}

export async function getSessionUser(sessionId: string) {
  try {
    const sessions = await sql`
      SELECT s.*, u.id as user_id, u.name, u.email, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ${sessionId}
      AND s.expires_at > NOW()
    `

    const session = sessions[0]
    if (!session) {
      return null
    }

    return {
      id: session.user_id,
      name: session.name,
      email: session.email,
      role: session.role,
    }
  } catch (error) {
    console.error("Error getting session user:", error)
    return null
  }
}

export async function deleteSession(sessionId: string) {
  try {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`
    return true
  } catch (error) {
    console.error("Error deleting session:", error)
    return false
  }
}

// Create admin user if it doesn't exist
export async function ensureAdminUser() {
  try {
    const adminEmail = "admin@fitnest.ma"
    const existingAdmin = await sql`SELECT id FROM users WHERE email = ${adminEmail}`

    if (existingAdmin.length === 0) {
      const hashedPassword = simpleHash("admin123")

      await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('Admin', ${adminEmail}, ${hashedPassword}, 'admin')
      `
      console.log("Admin user created")
    }

    return true
  } catch (error) {
    console.error("Error ensuring admin user:", error)
    return false
  }
}

// Helper function to get user ID from either NextAuth or custom JWT
async function getUserId() {
  const cookieStore = cookies()
  let userId = null

  // 1. Try NextAuth session token
  const nextAuthToken = cookieStore.get("next-auth.session-token")?.value
  if (nextAuthToken) {
    try {
      const sessions = await sql`
        SELECT * FROM sessions WHERE id = ${nextAuthToken} AND expires_at > NOW() LIMIT 1
      `
      if (sessions.length > 0) {
        userId = sessions[0].user_id
        console.log("Authenticated via NextAuth session token:", userId)
        return userId
      } else {
        console.warn("NextAuth session token invalid or expired")
      }
    } catch (nextAuthError) {
      console.error("NextAuth session token check failed:", nextAuthError)
    }
  }

  // 2. Try custom JWT
  const jwtToken = cookieStore.get("session")?.value
  if (jwtToken) {
    try {
      const payload = await decrypt(jwtToken)
      if (payload && payload.userId) {
        const users = await sql`
          SELECT * FROM users WHERE id = ${payload.userId} LIMIT 1
        `
        if (users.length > 0) {
          userId = users[0].id
          console.log("Authenticated via custom JWT:", userId)
          return userId
        } else {
          console.warn("Custom JWT user ID not found in database")
        }
      } else {
        console.warn("Custom JWT payload invalid")
      }
    } catch (jwtError) {
      console.error("Custom JWT decryption error:", jwtError)
    }
  }

  // 3. If all else fails, log and throw an error
  console.error("Authentication failed: No valid session found")
  throw new Error("User not authenticated")
}
