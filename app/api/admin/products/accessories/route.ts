import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Create accessories table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS accessories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        color VARCHAR(50),
        size VARCHAR(50),
        stock INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if we have sample data
    const accessoryCount = await sql`SELECT COUNT(*) as count FROM accessories`

    if (accessoryCount[0].count === 0) {
      // Insert sample accessories
      await sql`
        INSERT INTO accessories (name, description, price, category, color, size, stock, active)
        VALUES 
          ('Fitnest Gym Bag', 'Premium gym bag with multiple compartments', 39.99, 'bag', 'Black', 'Large', 25, true),
          ('Fitnest Water Bottle', 'Insulated stainless steel water bottle', 19.99, 'bottle', 'Blue', '750ml', 50, true),
          ('Fitnest T-Shirt', 'Comfortable cotton fitness t-shirt', 24.99, 'apparel', 'Green', 'M', 30, true),
          ('Meal Prep Containers', 'BPA-free meal prep container set', 29.99, 'equipment', 'Clear', 'Set of 5', 40, true),
          ('Protein Shaker', 'Leak-proof protein shaker with mixer ball', 12.99, 'bottle', 'Red', '600ml', 60, true),
          ('Fitnest Hoodie', 'Warm hoodie for post-workout comfort', 49.99, 'apparel', 'Gray', 'L', 20, true)
      `
    }

    const accessories = await sql`
      SELECT 
        id,
        name,
        description,
        price,
        category,
        color,
        size,
        stock,
        active,
        created_at as "createdAt"
      FROM accessories
      ORDER BY created_at DESC
    `

    return NextResponse.json(accessories)
  } catch (error) {
    console.error("Error fetching accessories:", error)
    return NextResponse.json({ error: "Failed to fetch accessories" }, { status: 500 })
  }
}
