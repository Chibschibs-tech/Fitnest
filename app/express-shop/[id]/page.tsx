import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getProductById, ensureProductsExist } from "@/lib/db-utils"
import { AddToCartForm } from "./add-to-cart-form"

export const dynamic = "force-dynamic"

export default async function ProductDetail({ params }: { params: { id: string } }) {
  // Ensure products exist
  await ensureProductsExist()

  // Get product by ID
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/express-shop" className="text-green-600 hover:underline">
          ← Back to Express Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        <div>
          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
          <p className="mb-6 text-gray-600">{product.description}</p>

          <div className="mb-6">
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">{product.salePrice} MAD</span>
                <span className="text-lg text-gray-500 line-through">{product.price} MAD</span>
              </div>
            ) : (
              <span className="text-2xl font-bold">{product.price} MAD</span>
            )}
          </div>

          <AddToCartForm productId={product.id} />
        </div>
      </div>
    </div>
  )
}
