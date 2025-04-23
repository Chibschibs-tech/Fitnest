import { Pool } from "@neondatabase/serverless"

// Create a singleton for the database connection
let pool: Pool | null = null

export function getPool() {
  if (!pool) {
    const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error("Database connection string is not defined")
    }

    try {
      pool = new Pool({ connectionString })
    } catch (error) {
      console.error("Error creating database pool:", error)
      throw new Error("Failed to initialize database connection")
    }
  }

  return pool
}

export async function testConnection() {
  const pool = getPool()
  const client = await pool.connect()
  try {
    const result = await client.query("SELECT 1 as test")
    return result.rows[0]
  } finally {
    client.release()
  }
}
