import { Pool } from "pg"

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL

    if (!connectionString) {
      throw new Error("No database connection string found in environment variables")
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Required for some hosting environments
      },
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 5000, // How long to wait for a connection to become available
    })

    // Add error handler to prevent pool crashes
    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err)
      // Don't throw, just log - this prevents the app from crashing
    })
  }
  return pool
}

// Helper function to check database connectivity
export async function checkDatabaseConnection() {
  try {
    const pool = getPool()
    const client = await pool.connect()
    try {
      await client.query("SELECT 1") // Simple query to test connection
      return { connected: true }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Database connection check failed:", error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
