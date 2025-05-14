import { neon } from "@neondatabase/serverless"
import Link from "next/link"
import Image from "next/image"
import { AddToCartButton } from "./add-to-cart-button"

export const dynamic = "force-dynamic"

async function getProducts() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Ensure products table exists and has data
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/ensure-products`, { cache: "no-store" })

    const products = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        saleprice as "salePrice", 
        imageurl as "imageUrl", 
        category
      FROM products
      LIMIT 20
    `

    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function ExpressShop() {
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Express Shop</h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          Browse our selection of healthy snacks, protein bars, and more for quick delivery.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 text-center">
          <p>No products available at this time. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product: any) => (
            <div key={product.id} className="overflow-hidden rounded-lg border bg-white shadow">
              <div className="relative h-48 w-full bg-gray-100">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
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
                  <span className="text-lg font-bold">{product.salePrice || product.price} MAD</span>
                  <div className="flex gap-2">
                    <Link
                      href={`/express-shop/${product.id}`}
                      className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                    >
                      View Details
                    </Link>
                    <AddToCartButton productId={product.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
