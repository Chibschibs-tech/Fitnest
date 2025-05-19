import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Force dynamic to prevent caching issues
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // First, check if the products table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists
    `

    if (!tableCheck[0].exists) {
      // Table doesn't exist, create it and seed with data
      await createProductsTable(sql)
      return NextResponse.json({ message: "Products table created, please refresh" })
    }

    // Check column structure
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'products'
    `

    const columnNames = columns.map((col) => col.column_name)
    console.log("Available columns:", columnNames)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 20

    // Build a dynamic query based on available columns
    let query = `SELECT id, name, description, price`

    // Add optional columns if they exist
    if (columnNames.includes("sale_price")) {
      query += `, sale_price as "salePrice"`
    } else if (columnNames.includes("saleprice")) {
      query += `, saleprice as "salePrice"`
    }

    if (columnNames.includes("image_url")) {
      query += `, image_url as "imageUrl"`
    } else if (columnNames.includes("imageurl")) {
      query += `, imageurl as "imageUrl"`
    }

    if (columnNames.includes("category")) {
      query += `, category`
    }

    if (columnNames.includes("stock")) {
      query += `, stock`
    }

    query += ` FROM products`

    // Add WHERE clause if needed
    const whereConditions = []
    const queryParams = []

    if (category) {
      whereConditions.push(`category = $${queryParams.length + 1}`)
      queryParams.push(category)
    }

    // Add isactive filter only if the column exists
    if (columnNames.includes("isactive")) {
      whereConditions.push(`isactive = true`)
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ` + whereConditions.join(" AND ")
    }

    query += ` ORDER BY id ASC LIMIT $${queryParams.length + 1}`
    queryParams.push(limit)

    console.log("Executing query:", query)
    console.log("With params:", queryParams)

    // Execute query
    const result = await sql.query(query, queryParams)

    if (!result.rows || result.rows.length === 0) {
      // No products found, seed the table
      await seedProducts(sql, columnNames)
      const newResult = await sql.query(query, queryParams)
      return NextResponse.json(newResult.rows)
    }

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching products:", error)
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

async function createProductsTable(sql) {
  // Create a basic products table
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      sale_price DECIMAL(10, 2),
      category TEXT,
      image_url TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Seed with initial data
  await seedProducts(sql, ["id", "name", "description", "price", "sale_price", "category", "image_url", "stock"])
}

async function seedProducts(sql, columnNames) {
  // Sample products data
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
    {
      id: "protein-pancake-1",
      name: "Protein Pancake Mix",
      description: "Make delicious protein pancakes at home.",
      price: 89.99,
      sale_price: 79.99,
      category: "breakfast",
      image_url: "/healthy-protein-pancake-mix.png",
      stock: 30,
    },
  ]

  // Check if we need to use snake_case or camelCase column names
  const useSnakeCase = columnNames.includes("sale_price") && columnNames.includes("image_url")

  for (const product of sampleProducts) {
    // Build dynamic insert based on available columns
    const columns = ["id", "name", "description", "price"]
    const values = [product.id, product.name, product.description, product.price]
    const placeholders = ["$1", "$2", "$3", "$4"]
    let index = 5

    if (useSnakeCase) {
      if (columnNames.includes("sale_price")) {
        columns.push("sale_price")
        values.push(product.sale_price)
        placeholders.push(`$${index++}`)
      }

      if (columnNames.includes("category")) {
        columns.push("category")
        values.push(product.category)
        placeholders.push(`$${index++}`)
      }

      if (columnNames.includes("image_url")) {
        columns.push("image_url")
        values.push(product.image_url)
        placeholders.push(`$${index++}`)
      }

      if (columnNames.includes("stock")) {
        columns.push("stock")
        values.push(product.stock)
        placeholders.push(`$${index++}`)
      }
    } else {
      // Use camelCase column names
      if (columnNames.includes("saleprice")) {
        columns.push("saleprice")
        values.push(product.sale_price)
        placeholders.push(`$${index++}`)
      }

      if (columnNames.includes("category")) {
        columns.push("category")
        values.push(product.category)
        placeholders.push(`$${index++}`)
      }

      if (columnNames.includes("imageurl")) {
        columns.push("imageurl")
        values.push(product.image_url)
        placeholders.push(`$${index++}`)
      }

      if (columnNames.includes("stock")) {
        columns.push("stock")
        values.push(product.stock)
        placeholders.push(`$${index++}`)
      }
    }

    const query = `
      INSERT INTO products (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      ON CONFLICT (id) DO NOTHING
    `

    await sql.query(query, values)
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description || !data.price) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, and price are required" },
        { status: 400 },
      )
    }

    // Check if table exists and create if needed
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists
    `

    if (!tableCheck[0].exists) {
      await createProductsTable(sql)
    }

    // Check column structure
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'products'
    `

    const columnNames = columns.map((col) => col.column_name)

    // Generate a unique ID if not provided
    const id = data.id || `product-${Date.now()}`

    // Build dynamic insert based on available columns
    const insertColumns = ["id", "name", "description", "price"]
    const insertValues = [id, data.name, data.description, data.price]
    const placeholders = ["$1", "$2", "$3", "$4"]
    let index = 5

    // Use snake_case if those columns exist
    if (columnNames.includes("sale_price")) {
      insertColumns.push("sale_price")
      insertValues.push(data.salePrice || null)
      placeholders.push(`$${index++}`)
    } else if (columnNames.includes("saleprice")) {
      insertColumns.push("saleprice")
      insertValues.push(data.salePrice || null)
      placeholders.push(`$${index++}`)
    }

    if (columnNames.includes("category")) {
      insertColumns.push("category")
      insertValues.push(data.category || null)
      placeholders.push(`$${index++}`)
    }

    if (columnNames.includes("image_url")) {
      insertColumns.push("image_url")
      insertValues.push(data.imageUrl || null)
      placeholders.push(`$${index++}`)
    } else if (columnNames.includes("imageurl")) {
      insertColumns.push("imageurl")
      insertValues.push(data.imageUrl || null)
      placeholders.push(`$${index++}`)
    }

    if (columnNames.includes("stock")) {
      insertColumns.push("stock")
      insertValues.push(data.stock || 0)
      placeholders.push(`$${index++}`)
    }

    const query = `
      INSERT INTO products (${insertColumns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *
    `

    const result = await sql.query(query, insertValues)

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        error: "Failed to create product",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
