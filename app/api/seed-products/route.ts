import { NextResponse } from "next/server"
import { sql } from "@neondatabase/serverless"

// Define the products table if it doesn't exist in db.ts
const products = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  salePrice: "salePrice",
  imageUrl: "imageUrl",
  category: "category",
  tags: "tags",
  nutritionalInfo: "nutritionalInfo",
  stock: "stock",
  isActive: "isActive",
}

export async function GET() {
  try {
    console.log("Starting product seeding process...")

    // First, check if the products table exists, if not create it
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price INTEGER NOT NULL,
          salePrice INTEGER,
          imageUrl VARCHAR(255),
          category VARCHAR(100),
          tags TEXT,
          nutritionalInfo JSONB,
          stock INTEGER DEFAULT 0,
          isActive BOOLEAN DEFAULT true
        );
      `
      console.log("Products table verified or created")
    } catch (tableError) {
      console.error("Error creating products table:", tableError)
      return NextResponse.json({ error: "Failed to create products table", details: tableError }, { status: 500 })
    }

    // Check if products already exist
    const existingProductsResult = await sql`SELECT COUNT(*) FROM products`
    const existingCount = Number.parseInt(existingProductsResult.rows[0].count)

    if (existingCount > 0) {
      return NextResponse.json({ message: "Products already seeded", count: existingCount })
    }

    console.log("No existing products found, proceeding with seeding...")

    // Sample products data with more variety
    const sampleProducts = [
      // Individual Protein Bars
      {
        name: "Protein Power Bar",
        description: "High protein bar with 20g of protein, perfect for post-workout recovery.",
        price: 25,
        salePrice: null,
        imageUrl: "/protein-bar.png",
        category: "protein_bars",
        tags: "protein, workout, recovery, individual",
        nutritionalInfo: JSON.stringify({
          calories: 240,
          protein: 20,
          carbs: 15,
          fat: 9,
          fiber: 5,
          sugar: 2,
        }),
        stock: 100,
        isActive: true,
      },
      {
        name: "Chocolate Peanut Butter Protein Bar",
        description: "Delicious chocolate and peanut butter flavored protein bar with 18g of protein.",
        price: 28,
        salePrice: 25,
        imageUrl: "/placeholder.svg?key=iicgj",
        category: "protein_bars",
        tags: "chocolate, peanut butter, protein, individual",
        nutritionalInfo: JSON.stringify({
          calories: 250,
          protein: 18,
          carbs: 20,
          fat: 10,
          fiber: 4,
          sugar: 3,
        }),
        stock: 85,
        isActive: true,
      },
      {
        name: "Vanilla Almond Protein Bar",
        description: "Smooth vanilla flavor with crunchy almonds and 15g of protein.",
        price: 26,
        salePrice: null,
        imageUrl: "/placeholder.svg?key=0zsw4",
        category: "protein_bars",
        tags: "vanilla, almond, protein, individual",
        nutritionalInfo: JSON.stringify({
          calories: 220,
          protein: 15,
          carbs: 18,
          fat: 8,
          fiber: 3,
          sugar: 2,
        }),
        stock: 75,
        isActive: true,
      },
      {
        name: "Berry Blast Protein Bar",
        description: "Mixed berry flavored protein bar with 16g of protein and antioxidants.",
        price: 27,
        salePrice: null,
        imageUrl: "/berry-protein-bar.png",
        category: "protein_bars",
        tags: "berry, antioxidants, protein, individual",
        nutritionalInfo: JSON.stringify({
          calories: 230,
          protein: 16,
          carbs: 22,
          fat: 7,
          fiber: 4,
          sugar: 5,
        }),
        stock: 60,
        isActive: true,
      },

      // Protein Bar Packs
      {
        name: "Protein Power Bar - Pack of 3",
        description: "Pack of 3 high protein bars with 20g of protein each, perfect for post-workout recovery.",
        price: 70,
        salePrice: 65,
        imageUrl: "/protein-bar-pack.png",
        category: "protein_bars",
        tags: "protein, workout, recovery, pack, value",
        nutritionalInfo: JSON.stringify({
          calories: 240,
          protein: 20,
          carbs: 15,
          fat: 9,
          fiber: 5,
          sugar: 2,
        }),
        stock: 50,
        isActive: true,
      },
      {
        name: "Chocolate Peanut Butter Protein Bar - Pack of 6",
        description: "Value pack of 6 chocolate and peanut butter flavored protein bars with 18g of protein each.",
        price: 150,
        salePrice: 140,
        imageUrl: "/chocolate-peanut-butter-protein-bars.png",
        category: "protein_bars",
        tags: "chocolate, peanut butter, protein, pack, value",
        nutritionalInfo: JSON.stringify({
          calories: 250,
          protein: 18,
          carbs: 20,
          fat: 10,
          fiber: 4,
          sugar: 3,
        }),
        stock: 40,
        isActive: true,
      },
      {
        name: "Mixed Flavors Protein Bars - Pack of 12",
        description: "Variety pack with 3 bars each of our 4 popular flavors. Perfect for trying different options.",
        price: 280,
        salePrice: 260,
        imageUrl: "/protein-bar-variety-pack.png",
        category: "protein_bars",
        tags: "variety, mixed flavors, protein, pack, value",
        nutritionalInfo: JSON.stringify({
          calories: 235,
          protein: 17,
          carbs: 19,
          fat: 8,
          fiber: 4,
          sugar: 3,
        }),
        stock: 30,
        isActive: true,
      },

      // Granola - Different Sizes
      {
        name: "Maple Pecan Granola - 250g",
        description: "Small pack of crunchy granola with maple syrup and pecans, perfect for breakfast or snacking.",
        price: 35,
        salePrice: 30,
        imageUrl: "/placeholder.svg?key=c0pgy",
        category: "granola",
        tags: "maple, pecan, breakfast, small size",
        nutritionalInfo: JSON.stringify({
          calories: 180,
          protein: 5,
          carbs: 25,
          fat: 8,
          fiber: 3,
          sugar: 10,
        }),
        stock: 50,
        isActive: true,
      },
      {
        name: "Maple Pecan Granola - 500g",
        description: "Medium pack of crunchy granola with maple syrup and pecans, perfect for breakfast or snacking.",
        price: 65,
        salePrice: 60,
        imageUrl: "/maple-pecan-granola-medium-pack.png",
        category: "granola",
        tags: "maple, pecan, breakfast, medium size",
        nutritionalInfo: JSON.stringify({
          calories: 180,
          protein: 5,
          carbs: 25,
          fat: 8,
          fiber: 3,
          sugar: 10,
        }),
        stock: 40,
        isActive: true,
      },
      {
        name: "Maple Pecan Granola - 1kg",
        description:
          "Family size pack of crunchy granola with maple syrup and pecans, perfect for breakfast or snacking.",
        price: 120,
        salePrice: 110,
        imageUrl: "/maple-pecan-granola-large-pack.png",
        category: "granola",
        tags: "maple, pecan, breakfast, family size",
        nutritionalInfo: JSON.stringify({
          calories: 180,
          protein: 5,
          carbs: 25,
          fat: 8,
          fiber: 3,
          sugar: 10,
        }),
        stock: 30,
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
        nutritionalInfo: JSON.stringify({
          calories: 170,
          protein: 4,
          carbs: 24,
          fat: 7,
          fiber: 3,
          sugar: 9,
        }),
        stock: 65,
        isActive: true,
      },
      {
        name: "Honey Almond Granola - 500g",
        description: "Medium pack of sweet honey granola with sliced almonds and oats.",
        price: 60,
        salePrice: 55,
        imageUrl: "/placeholder.svg?height=400&width=400&query=honey+almond+granola+medium+pack",
        category: "granola",
        tags: "honey, almond, breakfast, medium size",
        nutritionalInfo: JSON.stringify({
          calories: 170,
          protein: 4,
          carbs: 24,
          fat: 7,
          fiber: 3,
          sugar: 9,
        }),
        stock: 45,
        isActive: true,
      },
      {
        name: "Honey Almond Granola - 1kg",
        description: "Family size pack of sweet honey granola with sliced almonds and oats.",
        price: 115,
        salePrice: 105,
        imageUrl: "/placeholder.svg?height=400&width=400&query=honey+almond+granola+large+pack",
        category: "granola",
        tags: "honey, almond, breakfast, family size",
        nutritionalInfo: JSON.stringify({
          calories: 170,
          protein: 4,
          carbs: 24,
          fat: 7,
          fiber: 3,
          sugar: 9,
        }),
        stock: 35,
        isActive: true,
      },
      // Add a few more products to keep the list manageable
      {
        name: "Chocolate Chunk Granola - 250g",
        description: "Small pack of chocolate lovers' granola with dark chocolate chunks and cocoa.",
        price: 38,
        salePrice: null,
        imageUrl: "/placeholder.svg?height=400&width=400&query=chocolate+granola",
        category: "granola",
        tags: "chocolate, breakfast, snack, small size",
        nutritionalInfo: JSON.stringify({
          calories: 190,
          protein: 4,
          carbs: 26,
          fat: 9,
          fiber: 3,
          sugar: 12,
        }),
        stock: 45,
        isActive: true,
      },
      {
        name: "Peanut Butter Energy Balls",
        description: "No-bake peanut butter energy balls with oats and honey.",
        price: 40,
        salePrice: 35,
        imageUrl: "/placeholder.svg?height=400&width=400&query=peanut+butter+energy+balls",
        category: "energy_balls",
        tags: "peanut butter, energy, snack",
        nutritionalInfo: JSON.stringify({
          calories: 120,
          protein: 5,
          carbs: 15,
          fat: 6,
          fiber: 2,
          sugar: 8,
        }),
        stock: 80,
        isActive: true,
      },
      {
        name: "Peanut Butter Energy Balls - Pack of 12",
        description: "Value pack of 12 no-bake peanut butter energy balls with oats and honey.",
        price: 110,
        salePrice: 100,
        imageUrl: "/placeholder.svg?height=400&width=400&query=peanut+butter+energy+balls+pack",
        category: "energy_balls",
        tags: "peanut butter, energy, snack, pack, value",
        nutritionalInfo: JSON.stringify({
          calories: 120,
          protein: 5,
          carbs: 15,
          fat: 6,
          fiber: 2,
          sugar: 8,
        }),
        stock: 40,
        isActive: true,
      },
      {
        name: "Protein Pancake Mix",
        description: "Easy-to-make protein pancake mix with 15g of protein per serving.",
        price: 55,
        salePrice: 48,
        imageUrl: "/placeholder.svg?height=400&width=400&query=protein+pancake+mix",
        category: "breakfast",
        tags: "pancake, protein, breakfast",
        nutritionalInfo: JSON.stringify({
          calories: 200,
          protein: 15,
          carbs: 25,
          fat: 3,
          fiber: 2,
          sugar: 5,
        }),
        stock: 40,
        isActive: true,
      },
    ]

    console.log(`Preparing to insert ${sampleProducts.length} products...`)

    // Insert products using raw SQL for better control
    for (const product of sampleProducts) {
      await sql`
        INSERT INTO products 
        (name, description, price, salePrice, imageUrl, category, tags, nutritionalInfo, stock, isActive)
        VALUES 
        (${product.name}, ${product.description}, ${product.price}, ${product.salePrice}, 
         ${product.imageUrl}, ${product.category}, ${product.tags}, ${product.nutritionalInfo}::jsonb, 
         ${product.stock}, ${product.isActive})
      `
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
