import { getPool } from "./db-connection"
import { neon } from "@neondatabase/serverless"

/**
 * Tests the database connection specifically for authentication
 */
export async function testAuthDbConnection() {
  try {
    // Test pool connection
    const pool = getPool()
    const client = await pool.connect()

    try {
      const result = await client.query("SELECT 1 as test")
      return {
        poolConnection: true,
        poolResult: result.rows[0],
      }
    } finally {
      client.release()
    }
  } catch (poolError) {
    console.error("Pool connection test failed:", poolError)

    // If pool fails, try direct neon connection as fallback
    try {
      const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "")
      const result = await sql`SELECT 1 as test`
      return {
        poolConnection: false,
        directConnection: true,
        directResult: result[0],
      }
    } catch (directError) {
      console.error("Direct connection test failed:", directError)
      return {
        poolConnection: false,
        directConnection: false,
        error: directError,
      }
    }
  }
}

/**
 * Validates that all required environment variables for auth are set
 */
export function validateAuthEnvironment() {
  const requiredVars = ["NEXTAUTH_URL", "NEXTAUTH_SECRET", "DATABASE_URL"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  return {
    valid: missing.length === 0,
    missing,
  }
}
