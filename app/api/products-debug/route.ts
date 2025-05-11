import { NextResponse } from "next/server"
import { db, products } from "@/lib/db"

export async function GET() {
  try {
    // Get all products regardless of isActive status
    const allProducts = await db.select().from(products)

    // Count products by category
    const categories = {}
    allProducts.forEach((product) => {
      if (!categories[product.category]) {
        categories[product.category] = 0
      }
      categories[product.category]++
    })

    return NextResponse.json({
      totalProducts: allProducts.length,
      activeProducts: allProducts.filter((p) => p.isActive).length,
      categories,
      products: allProducts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        isActive: p.isActive,
      })),
    })
  } catch (error) {
    console.error("Error in products-debug:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch products for debugging",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
