import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Create meals table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS meals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        subscription_price DECIMAL(10,2),
        category VARCHAR(100),
        availability VARCHAR(50) DEFAULT 'both',
        calories INTEGER,
        protein DECIMAL(5,2),
        carbs DECIMAL(5,2),
        fat DECIMAL(5,2),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if we have sample data
    const mealCount = await sql`SELECT COUNT(*) as count FROM meals`

    if (mealCount[0].count === 0) {
      // Insert sample meals
      await sql`
        INSERT INTO meals (name, description, price, subscription_price, category, availability, calories, protein, carbs, fat, active)
        VALUES 
          ('Grilled Chicken & Vegetables', 'Lean grilled chicken breast with seasonal vegetables', 12.99, 10.99, 'lunch', 'both', 450, 35, 25, 18, true),
          ('Salmon Quinoa Bowl', 'Fresh salmon with quinoa and mixed greens', 15.99, 13.99, 'dinner', 'both', 520, 32, 35, 22, true),
          ('Protein Pancakes', 'High-protein pancakes with berries', 8.99, 7.99, 'breakfast', 'express_shop', 380, 25, 45, 8, true),
          ('Turkey Meatballs', 'Lean turkey meatballs with marinara sauce', 11.99, 9.99, 'lunch', 'subscription_only', 420, 28, 20, 16, true),
          ('Keto Avocado Bowl', 'Avocado bowl with nuts and seeds', 10.99, 8.99, 'breakfast', 'both', 350, 12, 15, 28, true),
          ('Beef Stir Fry', 'Lean beef with mixed vegetables', 13.99, 11.99, 'dinner', 'both', 480, 30, 28, 20, true)
      `
    }

    const meals = await sql`
      SELECT 
        id,
        name,
        description,
        price,
        subscription_price as "subscriptionPrice",
        category,
        availability,
        calories,
        protein,
        carbs,
        fat,
        active,
        created_at as "createdAt"
      FROM meals
      ORDER BY created_at DESC
    `

    return NextResponse.json(meals)
  } catch (error) {
    console.error("Error fetching meals:", error)
    return NextResponse.json({ error: "Failed to fetch meals" }, { status: 500 })
  }
}
