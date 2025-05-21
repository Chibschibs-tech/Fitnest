import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Force dynamic to prevent caching issues
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Use a try-catch block for the database connection
    let sql
    try {
      sql = neon(process.env.DATABASE_URL || "")
    } catch (dbConnError) {
      console.error("Database connection error:", dbConnError)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: dbConnError instanceof Error ? dbConnError.message : String(dbConnError),
        },
        { status: 500 },
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!, 10) : 20

    // Check if products table exists
    let tableExists
    try {
      tableExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'products'
        ) as exists
      `
    } catch (tableCheckError) {
      console.error("Error checking if products table exists:", tableCheckError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to check if products table exists",
          details: tableCheckError instanceof Error ? tableCheckError.message : String(tableCheckError),
        },
        { status: 500 },
      )
    }

    if (!tableExists[0].exists) {
      return NextResponse.json(
        {
          success: false,
          error: "Products table does not exist",
        },
        { status: 404 },
      )
    }

    // Build query based on parameters
    let query
    try {
      if (category) {
        query = await sql`
          SELECT 
            id, 
            name, 
            description, 
            price, 
            saleprice as "salePrice", 
            imageurl as "imageUrl", 
            category,
            tags,
            stock,
            isactive as "isActive"
          FROM products
          WHERE category = ${category}
          AND isactive = true
          ORDER BY id ASC
          LIMIT ${limit}
        `
      } else {
        query = await sql`
          SELECT 
            id, 
            name, 
            description, 
            price, 
            saleprice as "salePrice", 
            imageurl as "imageUrl", 
            category,
            tags,
            stock,
            isactive as "isActive"
          FROM products
          WHERE isactive = true
          ORDER BY id ASC
          LIMIT ${limit}
        `
      }
    } catch (queryError) {
      console.error("Error executing query:", queryError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to execute query",
          details: queryError instanceof Error ? queryError.message : String(queryError),
        },
        { status: 500 },
      )
    }

    console.log(`Query returned ${query.length} products`)

    return NextResponse.json({
      success: true,
      products: query,
    })
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
