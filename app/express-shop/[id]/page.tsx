import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getProductById, ensureProductsExist } from "@/lib/db-utils"
import { AddToCartForm } from "./add-to-cart-form"
import { ArrowLeft, Tag, Package, ShoppingBag } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ProductDetail({ params }: { params: { id: string } }) {
  // Ensure products exist
  await ensureProductsExist()

  // Get product by ID
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

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
      <div className="mb-8">
        <Link
          href="/express-shop"
          className="inline-flex items-center text-green-600 hover:text-green-700 hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Express Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
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

        <div className="flex flex-col space-y-6">
          <div>
            <div className="mb-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              {product.category}
            </div>
            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <div className="mb-4">
              {product.salePrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-green-600">{formatPrice(product.salePrice)}</span>
                  <span className="text-lg text-gray-500 line-through">{formatPrice(product.price)}</span>
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              )}
            </div>

            <AddToCartForm productId={product.id} />
          </div>

          <div className="space-y-4 rounded-lg bg-gray-50 p-4">
            <div className="flex items-start space-x-3">
              <Tag className="mt-1 h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-medium">Product Details</h3>
                <p className="text-sm text-gray-600">Category: {product.category}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Package className="mt-1 h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-medium">Shipping Information</h3>
                <p className="text-sm text-gray-600">
                  Free shipping on orders over 200 MAD. Delivery within 2-3 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <ShoppingBag className="mt-1 h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-medium">Return Policy</h3>
                <p className="text-sm text-gray-600">
                  30-day return policy. Please contact customer service for details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
