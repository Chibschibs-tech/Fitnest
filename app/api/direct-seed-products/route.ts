import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Log the database connection
    console.log("Database connection established")

    // Check if products table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'products'
      );
    `

    console.log("Table check result:", tableCheck)

    if (!tableCheck[0].exists) {
      console.log("Creating products table")
      // Create products table
      await sql`
        CREATE TABLE products (
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

    // Check product count
    const countResult = await sql`SELECT COUNT(*) FROM products`
    console.log("Product count:", countResult)

    if (Number.parseInt(countResult[0].count) === 0) {
      console.log("Seeding products table")
      // Seed with sample data
      await sql`
        INSERT INTO products (name, description, price, saleprice, imageurl, category) VALUES
        ('Protein Bar - Chocolate', 'Delicious chocolate protein bar with 20g of protein.', 25.00, 22.50, '/protein-bar.png', 'snacks'),
        ('Berry Protein Bar', 'Mixed berry protein bar with 18g of protein.', 25.00, 22.50, '/berry-protein-bar.png', 'snacks'),
        ('Honey Almond Granola', 'Crunchy granola with honey and almonds.', 35.00, 32.00, '/honey-almond-granola.png', 'breakfast'),
        ('Protein Pancake Mix', 'High-protein pancake mix for a healthy breakfast.', 45.00, 40.00, '/healthy-protein-pancake-mix.png', 'breakfast')
      `
    }

    // Verify products were added
    const products = await sql`SELECT * FROM products LIMIT 10`

    return NextResponse.json({
      success: true,
      message: "Products table checked and seeded if needed",
      tableExists: tableCheck[0].exists,
      productCount: countResult[0].count,
      sampleProducts: products,
    })
  } catch (error) {
    console.error("Error in direct-seed-products API:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
