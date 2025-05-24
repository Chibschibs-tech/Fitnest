import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface Session {
  id: string
  userId: number
  expiresAt: Date
}

// Simple password hashing without bcrypt - using built-in crypto
function simpleHash(password: string): string {
  // Create a simple hash using built-in methods
  let hash = 0
  const salt = "fitnest-salt-2024"
  const combined = password + salt

  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36)
}

function verifyPassword(password: string, hash: string): boolean {
  return simpleHash(password) === hash
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = generateSessionId()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  try {
    await sql`
      INSERT INTO user_sessions (id, user_id, expires_at, created_at)
      VALUES (${sessionId}, ${userId}, ${expiresAt.toISOString()}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        user_id = ${userId},
        expires_at = ${expiresAt.toISOString()},
        created_at = NOW()
    `
    return sessionId
  } catch (error) {
    console.error("Session creation error:", error)
    throw error
  }
}

export async function getSessionUser(sessionId: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT u.id, u.name, u.email, u.role
      FROM users u
      JOIN user_sessions s ON u.id = s.user_id
      WHERE s.id = ${sessionId} 
      AND s.expires_at > NOW()
      LIMIT 1
    `

    return result.length > 0 ? (result[0] as User) : null
  } catch (error) {
    console.error("Session lookup error:", error)
    return null
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await sql`DELETE FROM user_sessions WHERE id = ${sessionId}`
  } catch (error) {
    console.error("Session deletion error:", error)
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT id, name, email, password, role 
      FROM users 
      WHERE email = ${email} 
      LIMIT 1
    `

    if (users.length === 0) return null

    const user = users[0]
    if (!verifyPassword(password, user.password)) return null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  try {
    const hashedPassword = simpleHash(password)

    const result = await sql`
      INSERT INTO users (name, email, password, role, created_at, updated_at)
      VALUES (${name}, ${email}, ${hashedPassword}, 'customer', NOW(), NOW())
      RETURNING id, name, email, role
    `

    return result[0] as User
  } catch (error) {
    console.error("Create user error:", error)
    return null
  }
}

// Initialize session table
export async function initSessionTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
  } catch (error) {
    console.error("Session table init error:", error)
  }
}
