import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { neon } from "@neondatabase/serverless"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import { AddToCartButton } from "../add-to-cart-button"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} | Fitnest.ma`,
    description: product.description,
  }
}

async function getProduct(id: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const product = await sql`
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
        stock
      FROM products
      WHERE id = ${id} AND isactive = true
    `

    if (product.length === 0) {
      return null
    }

    return product[0]
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id)

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
      <Link href="/express-shop" className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-green-600">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Express Shop
      </Link>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingCart className="h-24 w-24 text-gray-300" />
            </div>
          )}
          {product.salePrice && (
            <Badge className="absolute right-4 top-4 bg-green-600 px-3 py-1 text-white">Sale</Badge>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <Badge variant="outline" className="capitalize">
                {product.category.replace("_", " ")}
              </Badge>
              {product.tags && (
                <div className="ml-2 flex flex-wrap gap-1">
                  {product.tags.split(",").map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {product.salePrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-green-600">{formatPrice(product.salePrice)}</span>
                <span className="text-xl text-gray-500 line-through">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            )}
            <p className="text-sm text-gray-500">
              {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 text-lg font-medium">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {product.nutritionalInfo && (
            <div>
              <h2 className="mb-2 text-lg font-medium">Nutritional Information</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                  <div key={key} className="rounded-md bg-gray-50 p-3">
                    <p className="text-sm text-gray-500 capitalize">{key}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <AddToCartButton productId={product.id} className="w-full" />
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <ShoppingCart className="h-4 w-4" />
              <span>Free shipping on orders over 200 MAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
