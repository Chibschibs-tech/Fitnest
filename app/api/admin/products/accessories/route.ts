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

    try {
      // Get accessories from existing products table
      const accessories = await sql`
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
        WHERE category IN ('bag', 'bottle', 'apparel', 'equipment')
        ORDER BY created_at DESC
      `

      // Transform data to match the interface
      const transformedAccessories = accessories.map((accessory: any) => ({
        id: accessory.id,
        name: accessory.name,
        description: accessory.description || "No description available",
        price: Number(accessory.price),
        category: accessory.category,
        color: null, // Not available in current schema
        size: null, // Not available in current schema
        stock: accessory.stock || 0,
        active: accessory.isActive,
        createdAt: accessory.createdAt,
      }))

      return NextResponse.json(transformedAccessories)
    } catch (dbError) {
      console.log("Products table not found or empty, returning empty array")
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Error fetching accessories:", error)
    return NextResponse.json({ error: "Failed to fetch accessories" }, { status: 500 })
  }
}
