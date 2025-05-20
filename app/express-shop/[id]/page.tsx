import { neon } from "@neondatabase/serverless"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft } from "lucide-react"
import AddToCartForm from "./add-to-cart-form"

export const dynamic = "force-dynamic"

async function getProduct(id: string) {
  try {
    const productId = Number.parseInt(id)
    if (isNaN(productId)) {
      return { error: "Invalid product ID" }
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get product details
    const products = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        saleprice as "salePrice", 
        imageurl as "imageUrl", 
        category, 
        tags, 
        nutritionalinfo as "nutritionalInfo",
        stock, 
        isactive as "isActive"
      FROM products
      WHERE id = ${productId} AND isactive = true
    `

    if (products.length === 0) {
      return { error: "Product not found" }
    }

    const product = products[0]

    // Parse numeric values
    return {
      ...product,
      price: Number.parseInt(product.price),
      salePrice: product.salePrice ? Number.parseInt(product.salePrice) : null,
      nutritionalInfo: product.nutritionalInfo ? product.nutritionalInfo : null,
      tags: product.tags ? product.tags.split(",").map((tag) => tag.trim()) : [],
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    return { error: "Failed to fetch product" }
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (product.error) {
    if (product.error === "Product not found") {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <Link href="/express-shop" className="mb-8 inline-flex items-center text-[#2B7A0B] hover:underline">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Express Shop
        </Link>

        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-red-700">Error Loading Product</h2>
          <p className="text-red-600">{product.error}</p>
        </div>
      </div>
    )
  }

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  // Calculate discount percentage
  const calculateDiscount = (price: number, salePrice: number) => {
    if (!salePrice) return null
    const discount = ((price - salePrice) / price) * 100
    return Math.round(discount)
  }

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/express-shop" className="mb-8 inline-flex items-center text-[#2B7A0B] hover:underline">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Express Shop
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          {product.salePrice && (
            <Badge className="absolute right-4 top-4 bg-red-500 px-3 py-1 text-base">
              {calculateDiscount(product.price, product.salePrice)}% OFF
            </Badge>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div>
            <Badge variant="outline" className="mb-2">
              {formatCategoryName(product.category)}
            </Badge>
            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

            <div className="mb-4">
              {product.salePrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#2B7A0B]">{formatPrice(product.salePrice)}</span>
                  <span className="text-lg text-gray-500 line-through">{formatPrice(product.price)}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-[#2B7A0B]">{formatPrice(product.price)}</span>
              )}
            </div>

            <div className="mb-6">
              <Badge
                variant={product.stock > 0 ? "outline" : "secondary"}
                className={product.stock > 0 ? "border-green-500 text-green-700" : "bg-gray-200 text-gray-700"}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <p className="mb-6 text-gray-700">{product.description}</p>

            {product.tags && product.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 font-medium">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Add to Cart Form */}
            <AddToCartForm product={product} />
          </div>

          {/* Nutritional Information */}
          {product.nutritionalInfo && (
            <div className="mt-8">
              <h3 className="mb-4 text-xl font-semibold">Nutritional Information</h3>
              <div className="rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-bold text-[#2B7A0B]">{value}</div>
                      <div className="text-sm text-gray-600">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
