import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get products from all tables that are available in express shop
    const expressProducts = await sql`
      SELECT 
        'meal' as product_type,
        id,
        name,
        description,
        price,
        category,
        CASE WHEN availability IN ('express_shop', 'both') THEN true ELSE false END as available,
        0 as stock,
        false as featured,
        0 as orders,
        0 as revenue,
        active,
        created_at as "createdAt"
      FROM meals
      WHERE availability IN ('express_shop', 'both')
      
      UNION ALL
      
      SELECT 
        'snack' as product_type,
        id,
        name,
        description,
        price,
        category,
        true as available,
        stock,
        false as featured,
        0 as orders,
        0 as revenue,
        active,
        created_at as "createdAt"
      FROM snacks
      WHERE availability = 'express_shop'
      
      UNION ALL
      
      SELECT 
        'accessory' as product_type,
        id,
        name,
        description,
        price,
        category,
        true as available,
        stock,
        false as featured,
        0 as orders,
        0 as revenue,
        active,
        created_at as "createdAt"
      FROM accessories
      
      ORDER BY "createdAt" DESC
    `

    // Transform the data to match the interface
    const transformedProducts = expressProducts.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      productType: product.product_type,
      featured: product.featured,
      stock: product.stock || 0,
      orders: product.orders || 0,
      revenue: product.revenue || 0,
      active: product.active,
      createdAt: product.createdAt,
    }))

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("Error fetching express shop products:", error)
    return NextResponse.json({ error: "Failed to fetch express shop products" }, { status: 500 })
  }
}
