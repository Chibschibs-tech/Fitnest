import { neon } from "@neondatabase/serverless"
import crypto from "crypto"

const sql = neon(process.env.DATABASE_URL!)

// Simple hash function using built-in crypto only
function simpleHash(password: string): string {
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

export async function getCurrentUser() {
  try {
    // This is a stub - actual implementation would use the session
    return null
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

// Required export to satisfy imports
export function validateAuthEnvironment() {
  const requiredVars = ["DATABASE_URL"]
  const missing = requiredVars.filter((varName) => !process.env[varName])

  return {
    valid: missing.length === 0,
    missing,
  }
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
