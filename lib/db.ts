import { neon } from "@neondatabase/serverless"

// Use the NEON_DATABASE_URL which is already available in the environment
const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("NEON_DATABASE_URL or DATABASE_URL environment variable is not set")
}

export const sql = neon(databaseUrl)
