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

    // Get products from existing products table
    const snacks = await sql`
      SELECT 
        id,
        name,
        description,
        price,
        sale_price as "salePrice",
        category,
        nutritional_info as "nutritionalInfo",
        stock,
        is_active as "isActive",
        created_at as "createdAt"
      FROM products
      WHERE category IN ('protein_bar', 'supplement', 'healthy_snack', 'drink')
      ORDER BY created_at DESC
    `

    // Transform data to match the interface
    const transformedSnacks = snacks.map((snack: any) => ({
      id: snack.id,
      name: snack.name,
      description: snack.description || "No description available",
      price: Number(snack.price),
      category: snack.category,
      availability: "express_shop",
      protein: snack.nutritionalInfo?.protein || 0,
      calories: snack.nutritionalInfo?.calories || 0,
      active: snack.isActive,
      stock: snack.stock || 0,
      createdAt: snack.createdAt,
    }))

    return NextResponse.json(transformedSnacks)
  } catch (error) {
    console.error("Error fetching snacks:", error)
    return NextResponse.json({ error: "Failed to fetch snacks" }, { status: 500 })
  }
}
