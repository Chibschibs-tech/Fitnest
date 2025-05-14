import Image from "next/image"
import Link from "next/link"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export default async function ExpressShop() {
  let products = []
  let error = null

  try {
    // First, ensure products exist by calling our direct seeding endpoint
    const seedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/direct-seed-products`, {
      cache: "no-store",
    })

    if (!seedResponse.ok) {
      throw new Error("Failed to seed products")
    }

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!)

    // Fetch products directly
    products = await sql`SELECT * FROM products LIMIT 20`

    console.log("Fetched products:", products)
  } catch (err) {
    console.error("Error in Express Shop page:", err)
    error = err
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Express Shop</h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          Browse our selection of healthy snacks, protein bars, and more for quick delivery.
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-md bg-red-50 p-4 text-red-800">
          <p>Error loading products: {String(error)}</p>
          <p className="mt-2">Please try refreshing the page or contact support.</p>
        </div>
      )}

      {!error && products.length === 0 ? (
        <div className="mt-8 text-center">
          <p>No products available at this time. Please check back later.</p>
          <div className="mt-4">
            <Link
              href="/api/direct-seed-products"
              className="inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Initialize Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="overflow-hidden rounded-lg border bg-white shadow">
              <div className="relative h-48 w-full bg-gray-100">
                {product.imageurl ? (
                  <Image
                    src={product.imageurl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-lg font-medium">{product.name}</h3>
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{product.saleprice || product.price} MAD</span>
                  <Link
                    href={`/express-shop/${product.id}`}
                    className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
