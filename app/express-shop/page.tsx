import Link from "next/link"
import Image from "next/image"
import { getProducts, ensureProductsExist } from "@/lib/db-utils"
import { AddToCartButton } from "./add-to-cart-button"

export const dynamic = "force-dynamic"

export default async function ExpressShop() {
  // Ensure products exist
  await ensureProductsExist()

  // Get products
  const products = await getProducts()

  // Get unique categories
  const categories = Array.from(new Set(products.map((product) => product.category)))

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Express Shop</h1>
        <p className="text-gray-600">Browse our selection of healthy snacks and supplements</p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/express-shop"
          className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          All Products
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/express-shop?category=${category}`}
            className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
          >
            {category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-gray-50 p-12 text-center">
          <h2 className="text-xl font-medium">No products found</h2>
          <p className="text-gray-600">We couldn't find any products matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
            >
              <Link href={`/express-shop/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-100">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                {product.salePrice && (
                  <div className="absolute left-0 top-0 m-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                    SALE
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2">
                  <div className="mb-1 text-xs text-gray-500">{product.category}</div>
                  <Link href={`/express-shop/${product.id}`} className="hover:text-green-600">
                    <h2 className="text-lg font-medium">{product.name}</h2>
                  </Link>
                  <p className="line-clamp-2 text-sm text-gray-600">{product.description}</p>
                </div>

                <div className="mt-auto space-y-3">
                  <div>
                    {product.salePrice ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">{formatPrice(product.salePrice)}</span>
                        <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                      </div>
                    ) : (
                      <span className="font-bold">{formatPrice(product.price)}</span>
                    )}
                  </div>

                  <AddToCartButton productId={product.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
