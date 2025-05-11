import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    console.log("Starting product seeding process...")

    // Initialize the Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // First, check if we can connect to the database
    try {
      const testConnection = await sql`SELECT 1 as test`
      console.log("Database connection successful:", testConnection[0])
    } catch (connectionError) {
      console.error("Database connection failed:", connectionError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: connectionError instanceof Error ? connectionError.message : String(connectionError),
        },
        { status: 500 },
      )
    }

    // Check if the products table exists
    try {
      const tableExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = 'products'
        ) as exists
      `

      console.log("Table check result:", tableExists[0])

      if (!tableExists[0].exists) {
        console.log("Products table does not exist, creating it...")

        // Create the products table
        await sql`
          CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            price INTEGER NOT NULL,
            "salePrice" INTEGER,
            "imageUrl" TEXT,
            category TEXT,
            tags TEXT,
            "nutritionalInfo" JSONB,
            stock INTEGER DEFAULT 0,
            "isActive" BOOLEAN DEFAULT true,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `
        console.log("Products table created successfully")
      } else {
        console.log("Products table already exists")
      }
    } catch (tableError) {
      console.error("Error checking/creating products table:", tableError)
      return NextResponse.json(
        {
          error: "Failed to create products table",
          details: tableError instanceof Error ? tableError.message : String(tableError),
        },
        { status: 500 },
      )
    }

    // Check if products already exist
    try {
      const existingProductsResult = await sql`SELECT COUNT(*) FROM products`
      const existingCount = Number.parseInt(existingProductsResult[0].count)

      if (existingCount > 0) {
        return NextResponse.json({ message: "Products already seeded", count: existingCount })
      }

      console.log("No existing products found, proceeding with seeding...")
    } catch (countError) {
      console.error("Error counting existing products:", countError)
      return NextResponse.json(
        {
          error: "Failed to check existing products",
          details: countError instanceof Error ? countError.message : String(countError),
        },
        { status: 500 },
      )
    }

    // Sample products data with more variety (reduced list for testing)
    const sampleProducts = [
      // Just a few products for initial testing
      {
        name: "Protein Power Bar",
        description: "High protein bar with 20g of protein, perfect for post-workout recovery.",
        price: 25,
        salePrice: null,
        imageUrl: "/protein-bar.png",
        category: "protein_bars",
        tags: "protein, workout, recovery, individual",
        nutritionalInfo: {
          calories: 240,
          protein: 20,
          carbs: 15,
          fat: 9,
          fiber: 5,
          sugar: 2,
        },
        stock: 100,
        isActive: true,
      },
      {
        name: "Honey Almond Granola - 250g",
        description: "Small pack of sweet honey granola with sliced almonds and oats.",
        price: 32,
        salePrice: null,
        imageUrl: "/honey-almond-granola.png",
        category: "granola",
        tags: "honey, almond, breakfast, small size",
        nutritionalInfo: {
          calories: 170,
          protein: 4,
          carbs: 24,
          fat: 7,
          fiber: 3,
          sugar: 9,
        },
        stock: 65,
        isActive: true,
      },
    ]

    console.log(`Preparing to insert ${sampleProducts.length} products...`)

    // Insert products one by one with better error handling
    for (const product of sampleProducts) {
      try {
        await sql`
          INSERT INTO products 
          (name, description, price, "salePrice", "imageUrl", category, tags, "nutritionalInfo", stock, "isActive")
          VALUES 
          (${product.name}, ${product.description}, ${product.price}, ${product.salePrice}, 
           ${product.imageUrl}, ${product.category}, ${product.tags}, ${JSON.stringify(product.nutritionalInfo)}::jsonb, 
           ${product.stock}, ${product.isActive})
        `
        console.log(`Inserted product: ${product.name}`)
      } catch (insertError) {
        console.error(`Error inserting product ${product.name}:`, insertError)
        return NextResponse.json(
          {
            error: `Failed to insert product: ${product.name}`,
            details: insertError instanceof Error ? insertError.message : String(insertError),
          },
          { status: 500 },
        )
      }
    }

    console.log("Products inserted successfully")

    return NextResponse.json({
      message: "Products seeded successfully",
      count: sampleProducts.length,
    })
  } catch (error) {
    console.error("Error seeding products:", error)
    return NextResponse.json(
      {
        error: "Failed to seed products",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
