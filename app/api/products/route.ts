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
      console.log("Products table doesn't exist, creating it")
      await createProductsTable(sql)
      return NextResponse.json({ message: "Products table created, please refresh" })
    }

    // Check column structure to determine naming convention
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'products'
      ORDER BY column_name
    `

    const columnNames = columns.map((col) => col.column_name)
    console.log("Available columns:", columnNames)

    // Determine if we're using snake_case or camelCase/lowercase
    const usesSnakeCase = columnNames.includes("sale_price") || columnNames.includes("image_url")

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 20

    // Build query based on column naming convention
    let query = `SELECT id, name, description, price`

    if (usesSnakeCase) {
      // Using snake_case columns
      if (columnNames.includes("sale_price")) {
        query += `, sale_price as "salePrice"`
      }

      if (columnNames.includes("image_url")) {
        query += `, image_url as "imageUrl"`
      }
    } else {
      // Using camelCase or lowercase columns
      if (columnNames.includes("saleprice")) {
        query += `, saleprice as "salePrice"`
      }

      if (columnNames.includes("imageurl")) {
        query += `, imageurl as "imageUrl"`
      }
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
    } else if (columnNames.includes("is_active")) {
      whereConditions.push(`is_active = true`)
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
  // Create a basic products table with camelCase/lowercase column names
  // since that seems to be what your database is using
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      saleprice DECIMAL(10, 2),
      category TEXT,
      imageurl TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      isactive BOOLEAN DEFAULT true,
      createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Seed with initial data
  await seedProducts(sql, [
    "id",
    "name",
    "description",
    "price",
    "saleprice",
    "category",
    "imageurl",
    "stock",
    "isactive",
  ])
}

async function seedProducts(sql, columnNames) {
  // Sample products data
  const sampleProducts = [
    {
      id: "protein-bar-1",
      name: "Protein Bar - Chocolate",
      description: "Delicious chocolate protein bar with 20g of protein.",
      price: 25.99,
      saleprice: null,
      category: "protein_bars",
      imageurl: "/protein-bar.png",
      stock: 100,
      isactive: true,
    },
    {
      id: "protein-bar-2",
      name: "Protein Bar - Berry",
      description: "Delicious berry protein bar with 18g of protein.",
      price: 25.99,
      saleprice: 19.99,
      category: "protein_bars",
      imageurl: "/berry-protein-bar.png",
      stock: 75,
      isactive: true,
    },
    {
      id: "granola-1",
      name: "Honey Almond Granola",
      description: "Crunchy granola with honey and almonds.",
      price: 45.99,
      saleprice: null,
      category: "granola",
      imageurl: "/honey-almond-granola.png",
      stock: 50,
      isactive: true,
    },
    {
      id: "protein-pancake-1",
      name: "Protein Pancake Mix",
      description: "Make delicious protein pancakes at home.",
      price: 89.99,
      saleprice: 79.99,
      category: "breakfast",
      imageurl: "/healthy-protein-pancake-mix.png",
      stock: 30,
      isactive: true,
    },
  ]

  for (const product of sampleProducts) {
    // Build dynamic insert based on available columns
    const columns = ["id", "name", "description", "price"]
    const values = [product.id, product.name, product.description, product.price]
    const placeholders = ["$1", "$2", "$3", "$4"]
    let index = 5

    // Use camelCase/lowercase column names since that's what your DB is using
    if (columnNames.includes("saleprice")) {
      columns.push("saleprice")
      values.push(product.saleprice)
      placeholders.push(`$${index++}`)
    }

    if (columnNames.includes("category")) {
      columns.push("category")
      values.push(product.category)
      placeholders.push(`$${index++}`)
    }

    if (columnNames.includes("imageurl")) {
      columns.push("imageurl")
      values.push(product.imageurl)
      placeholders.push(`$${index++}`)
    }

    if (columnNames.includes("stock")) {
      columns.push("stock")
      values.push(product.stock)
      placeholders.push(`$${index++}`)
    }

    if (columnNames.includes("isactive")) {
      columns.push("isactive")
      values.push(product.isactive)
      placeholders.push(`$${index++}`)
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

    // Use camelCase/lowercase column names since that's what your DB is using
    if (columnNames.includes("saleprice")) {
      insertColumns.push("saleprice")
      insertValues.push(data.salePrice || null)
      placeholders.push(`$${index++}`)
    }

    if (columnNames.includes("category")) {
      insertColumns.push("category")
      insertValues.push(data.category || null)
      placeholders.push(`$${index++}`)
    }

    if (columnNames.includes("imageurl")) {
      insertColumns.push("imageurl")
      insertValues.push(data.imageUrl || null)
      placeholders.push(`$${index++}`)
    }

    if (columnNames.includes("stock")) {
      insertColumns.push("stock")
      insertValues.push(data.stock || 0)
      placeholders.push(`$${index++}`)
    }

    if (columnNames.includes("isactive")) {
      insertColumns.push("isactive")
      insertValues.push(data.isActive !== undefined ? data.isActive : true)
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
