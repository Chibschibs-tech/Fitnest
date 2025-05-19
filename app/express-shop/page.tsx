import { neon } from "@neondatabase/serverless"
import { ExpressShopContent } from "./express-shop-content"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default async function ExpressShop() {
  console.log("Rendering Express Shop page")

  // Fetch products server-side
  let products = []
  let error = null
  const debugInfo = { timestamp: new Date().toISOString() }

  try {
    console.log("Connecting to database")
    const sql = neon(process.env.DATABASE_URL!)
    debugInfo.dbConnected = true

    // Simple query to get products
    console.log("Fetching products")
    const result = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        COALESCE(sale_price, saleprice) as "salePrice", 
        COALESCE(image_url, imageurl) as "imageUrl", 
        category,
        stock
      FROM products
      LIMIT 100
    `

    products = result
    debugInfo.productCount = products.length
    console.log(`Found ${products.length} products`)
  } catch (err) {
    console.error("Error fetching products:", err)
    error = err instanceof Error ? err.message : String(err)
    debugInfo.error = error
  }

  console.log("Rendering ExpressShopContent with:", {
    productCount: products.length,
    hasError: !!error,
  })

  // Return a simplified version that doesn't rely on client components
  return (
    <div>
      {/* Hidden debug info */}
      <div id="debug-info" style={{ display: "none" }}>
        {JSON.stringify(debugInfo)}
      </div>

      <ExpressShopContent initialProducts={products} initialError={error} initialDebugInfo={debugInfo} />
    </div>
  )
}
