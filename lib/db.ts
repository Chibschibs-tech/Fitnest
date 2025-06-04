import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.NEON_DATABASE_URL || process.env.DATABASE_URL!)

// Export mock objects that some files are trying to import
export const db = {
  query: sql,
  execute: sql,
}

export const orders = {}
export const products = {}
export const notificationPreferences = {}
export const mealPreferences = {}
