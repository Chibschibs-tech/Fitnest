import { type NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

// Force dynamic to prevent caching issues
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Get products from mock database
    let products = mockDb.getProducts()

    // Filter by category if provided
    if (category) {
      products = products.filter((product) => product.category === category)
    }

    // Only return active products
    products = products.filter((product) => product.isActive)

    return NextResponse.json(products)
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
