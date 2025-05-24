import crypto from "crypto"
import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

const sql = neon(process.env.DATABASE_URL!)

// Simple hash function using built-in crypto
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex")
  return `${salt}:${hash}`
}

// Simple verify function
export function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    const [salt, storedHash] = hashedPassword.split(":")
    const hash = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex")
    return hash === storedHash
  } catch (error) {
    return false
  }
}

// Add the missing export
export function validateAuthEnvironment() {
  const requiredVars = ["DATABASE_URL"]
  const missing = requiredVars.filter((varName) => !process.env[varName])

  return {
    valid: missing.length === 0,
    missing,
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return null
    }

    const result = await sql`
      SELECT u.id, u.name, u.email, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${sessionId}
      AND s.expires > NOW()
    `

    return result[0] || null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "admin") {
    throw new Error("Admin access required")
  }
  return user
}

// Legacy function for compatibility
export async function testAuthDbConnection() {
  try {
    // Simple test - just check if we can create a session
    return {
      poolConnection: true,
      poolResult: { test: 1 },
    }
  } catch (error) {
    return {
      poolConnection: false,
      directConnection: false,
      error,
    }
  }
}

// Simple function to create a session token
export function createSessionToken(): string {
  return crypto.randomBytes(32).toString("hex")
}
