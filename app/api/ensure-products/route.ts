import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if products table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      );
    `

    if (!tableExists[0].exists) {
      // Create products table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          saleprice DECIMAL(10, 2),
          imageurl VARCHAR(255),
          category VARCHAR(100),
          stock INTEGER DEFAULT 100,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    }

    // Check if products table has data
    const productCount = await sql`SELECT COUNT(*) FROM products`

    if (Number.parseInt(productCount[0].count) === 0) {
      // Seed products table with sample data
      await sql`
        INSERT INTO products (name, description, price, saleprice, imageurl, category) VALUES
        ('Protein Bar - Chocolate', 'Delicious chocolate protein bar with 20g of protein.', 25.00, 22.50, '/protein-bar.png', 'snacks'),
        ('Berry Protein Bar', 'Mixed berry protein bar with 18g of protein.', 25.00, 22.50, '/berry-protein-bar.png', 'snacks'),
        ('Honey Almond Granola', 'Crunchy granola with honey and almonds.', 35.00, 32.00, '/honey-almond-granola.png', 'breakfast'),
        ('Protein Pancake Mix', 'High-protein pancake mix for a healthy breakfast.', 45.00, 40.00, '/healthy-protein-pancake-mix.png', 'breakfast'),
        ('Protein Bar Variety Pack', 'Assortment of our best-selling protein bars.', 120.00, 99.00, '/protein-bar-variety-pack.png', 'bundles'),
        ('Chocolate Peanut Butter Protein Bars', 'Rich chocolate and peanut butter protein bars.', 25.00, 22.50, '/chocolate-peanut-butter-protein-bars.png', 'snacks'),
        ('Maple Pecan Granola - Medium Pack', 'Medium pack of our maple pecan granola.', 35.00, 32.00, '/maple-pecan-granola-medium-pack.png', 'breakfast'),
        ('Maple Pecan Granola - Large Pack', 'Large pack of our maple pecan granola.', 60.00, 55.00, '/maple-pecan-granola-large-pack.png', 'breakfast')
      `
    }

    return NextResponse.json({
      success: true,
      message: "Products table checked and seeded if needed",
      productCount: productCount[0].count,
    })
  } catch (error) {
    console.error("Error in ensure-products API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check or seed products table",
      },
      { status: 500 },
    )
  }
}
