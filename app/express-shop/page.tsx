import { ExpressShopContent } from "./express-shop-content"
import { neon } from "@neondatabase/serverless"

// Force dynamic rendering to avoid prerendering issues with useSession
export const dynamic = "force-dynamic"

export default async function ExpressShop() {
  // Fetch products server-side to avoid client-side fetch issues
  let products = []
  let error = null
  let debugInfo = null

  try {
    const sql = neon(process.env.DATABASE_URL!)

    // First, ensure the products table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists
    `

    debugInfo = { tableExists: tableExists[0].exists }

    if (!tableExists[0].exists) {
      // Create the products table
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

      // Seed with initial data - we'll let the API handle this
      debugInfo.tableCreated = true
    } else {
      // Get column names
      const columns = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      `

      const columnNames = columns.map((col) => col.column_name)
      debugInfo.columns = columnNames

      // Build query dynamically based on available columns
      let query = `SELECT id, name, description, price`

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

      // Add isactive filter only if the column exists
      if (columnNames.includes("isactive")) {
        whereConditions.push(`isactive = true`)
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ` + whereConditions.join(" AND ")
      }

      query += ` ORDER BY id ASC LIMIT 100`

      debugInfo.query = query

      try {
        const result = await sql.query(query)
        products = result.rows
        debugInfo.productCount = result.rows.length

        // If no products, check if we need to seed
        if (result.rows.length === 0) {
          debugInfo.noProducts = true
        }
      } catch (queryError) {
        debugInfo.queryError = queryError instanceof Error ? queryError.message : String(queryError)
        throw queryError
      }
    }
  } catch (err) {
    console.error("Error fetching products:", err)
    error = err instanceof Error ? err.message : String(err)
    debugInfo = { ...debugInfo, error }
  }

  return <ExpressShopContent initialProducts={products} initialError={error} initialDebugInfo={debugInfo} />
}
