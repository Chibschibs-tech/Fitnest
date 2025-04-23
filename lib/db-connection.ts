import { Pool } from "@neondatabase/serverless"

// Create a singleton for the database connection
let pool: Pool | null = null

export function getPool() {
  if (!pool) {
    const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error("Database connection string is not defined")
    }

    pool = new Pool({ connectionString })
  }

  return pool
}
