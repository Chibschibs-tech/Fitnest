import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get all products from the products table
    const expressProducts = await sql`
      SELECT 
        id,
        name,
        description,
        price,
        category,
        stock,
        is_active as "isActive",
        created_at as "createdAt"
      FROM products
      WHERE is_active = true
      ORDER BY created_at DESC
    `

    // Transform data to match the interface
    const transformedProducts = expressProducts.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description || "No description available",
      price: Number(product.price),
      category: product.category,
      productType: getProductType(product.category),
      featured: false, // Default to false, can be enhanced later
      stock: product.stock || 0,
      orders: 0, // Would need order tracking
      revenue: 0, // Would need order tracking
      active: product.isActive,
      createdAt: product.createdAt,
    }))

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("Error fetching express shop products:", error)
    return NextResponse.json({ error: "Failed to fetch express shop products" }, { status: 500 })
  }
}

function getProductType(category: string): string {
  const categoryMap: { [key: string]: string } = {
    protein_bar: "snack",
    supplement: "snack",
    healthy_snack: "snack",
    drink: "snack",
    bag: "accessory",
    bottle: "accessory",
    apparel: "accessory",
    equipment: "accessory",
  }
  return categoryMap[category] || "product"
}
