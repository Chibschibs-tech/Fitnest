import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Create snacks table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS snacks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        availability VARCHAR(50) DEFAULT 'express_shop',
        protein DECIMAL(5,2),
        calories INTEGER,
        stock INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if we have sample data
    const snackCount = await sql`SELECT COUNT(*) as count FROM snacks`

    if (snackCount[0].count === 0) {
      // Insert sample snacks
      await sql`
        INSERT INTO snacks (name, description, price, category, availability, protein, calories, stock, active)
        VALUES 
          ('Chocolate Protein Bar', 'High-protein chocolate flavored bar', 3.99, 'protein_bar', 'express_shop', 20, 250, 50, true),
          ('Vanilla Protein Bar', 'Creamy vanilla protein bar', 3.99, 'protein_bar', 'express_shop', 22, 240, 45, true),
          ('Mixed Nuts Pack', 'Premium mixed nuts for healthy snacking', 5.99, 'healthy_snack', 'express_shop', 8, 180, 30, true),
          ('Whey Protein Powder', 'Premium whey protein supplement', 29.99, 'supplement', 'express_shop', 25, 120, 20, true),
          ('Energy Drink', 'Natural energy drink with vitamins', 2.99, 'drink', 'express_shop', 0, 80, 100, true),
          ('Granola Bar', 'Organic granola bar with dried fruits', 2.49, 'healthy_snack', 'express_shop', 5, 160, 75, true)
      `
    }

    const snacks = await sql`
      SELECT 
        id,
        name,
        description,
        price,
        category,
        availability,
        protein,
        calories,
        stock,
        active,
        created_at as "createdAt"
      FROM snacks
      ORDER BY created_at DESC
    `

    return NextResponse.json(snacks)
  } catch (error) {
    console.error("Error fetching snacks:", error)
    return NextResponse.json({ error: "Failed to fetch snacks" }, { status: 500 })
  }
}
