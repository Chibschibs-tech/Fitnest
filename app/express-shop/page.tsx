import { ExpressShopContent } from "./express-shop-content"
import { neon } from "@neondatabase/serverless"

// Force dynamic rendering to avoid prerendering issues with useSession
export const dynamic = "force-dynamic"

export default async function ExpressShop() {
  // Fetch products server-side to avoid client-side fetch issues
  let products = []
  let error = null

  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if products table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists
    `

    if (tableExists[0].exists) {
      // Get column names
      const columns = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      `

      const columnNames = columns.map((col) => col.column_name)

      // Build query dynamically based on available columns
      let query = `SELECT id, name, description, price`

      if (columnNames.includes("saleprice")) {
        query += `, saleprice as "salePrice"`
      }

      if (columnNames.includes("imageurl")) {
        query += `, imageurl as "imageUrl"`
      }

      if (columnNames.includes("category")) {
        query += `, category`
      }

      if (columnNames.includes("stock")) {
        query += `, stock`
      }

      query += ` FROM products`

      if (columnNames.includes("isactive")) {
        query += ` WHERE isactive = true`
      }

      query += ` ORDER BY id ASC LIMIT 100`

      const result = await sql.query(query)
      products = result.rows
    }
  } catch (err) {
    console.error("Error fetching products:", err)
    error = err instanceof Error ? err.message : String(err)
  }

  return <ExpressShopContent initialProducts={products} initialError={error} />
}
