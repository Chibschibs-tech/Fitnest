import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Force dynamic to prevent caching issues
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("Simple products API called")
    const sql = neon(process.env.DATABASE_URL!)

    // Check if table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists
    `

    if (!tableExists[0].exists) {
      console.log("Products table doesn't exist, creating it")
      // Create table
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          sale_price DECIMAL(10, 2),
          category TEXT,
          image_url TEXT,
          stock INTEGER NOT NULL DEFAULT 0
        )
      `

      // Seed with sample data
      const sampleProducts = [
        {
          id: "protein-bar-1",
          name: "Protein Bar - Chocolate",
          description: "Delicious chocolate protein bar with 20g of protein.",
          price: 25.99,
          sale_price: null,
          category: "protein_bars",
          image_url: "/protein-bar.png",
          stock: 100,
        },
        {
          id: "protein-bar-2",
          name: "Protein Bar - Berry",
          description: "Delicious berry protein bar with 18g of protein.",
          price: 25.99,
          sale_price: 19.99,
          category: "protein_bars",
          image_url: "/berry-protein-bar.png",
          stock: 75,
        },
        {
          id: "granola-1",
          name: "Honey Almond Granola",
          description: "Crunchy granola with honey and almonds.",
          price: 45.99,
          sale_price: null,
          category: "granola",
          image_url: "/honey-almond-granola.png",
          stock: 50,
        },
      ]

      for (const product of sampleProducts) {
        await sql`
          INSERT INTO products (id, name, description, price, sale_price, category, image_url, stock)
          VALUES (${product.id}, ${product.name}, ${product.description}, ${product.price}, 
                  ${product.sale_price}, ${product.category}, ${product.image_url}, ${product.stock})
          ON CONFLICT (id) DO NOTHING
        `
      }

      // Return the newly created products
      const products = await sql`SELECT * FROM products`
      return NextResponse.json(products)
    }

    // Simple query to get all products
    const products = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        sale_price as "salePrice", 
        image_url as "imageUrl", 
        category,
        stock
      FROM products
      LIMIT 100
    `

    console.log(`Returning ${products.length} products`)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in simple products API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
