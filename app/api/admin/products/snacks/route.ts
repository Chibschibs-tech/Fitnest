import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get snacks from products table
    const snacks = await sql`
      SELECT 
        id,
        name,
        description,
        price,
        category,
        ingredients,
        allergens,
        nutritional_info,
        image_url,
        is_active as is_available,
        stock as stock_quantity,
        created_at
      FROM products
      WHERE category IN ('protein_bar', 'supplement', 'healthy_snack', 'drink')
      ORDER BY created_at DESC
    `

    // Transform the data to match expected format
    const transformedSnacks = snacks.map((snack: any) => ({
      ...snack,
      calories: snack.nutritional_info?.calories || 0,
      is_available: snack.is_available || false,
    }))

    return NextResponse.json({
      success: true,
      snacks: transformedSnacks,
    })
  } catch (error) {
    console.error("Error fetching snacks:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch snacks",
        snacks: [],
      },
      { status: 500 },
    )
  }
}
