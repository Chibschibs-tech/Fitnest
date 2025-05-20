import { neon } from "@neondatabase/serverless"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

async function getProducts() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if products table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      ) as exists
    `

    if (!tableCheck[0].exists) {
      return { error: "Products table does not exist" }
    }

    // Get all products
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
        stock, 
        isactive as "isActive"
      FROM products
      WHERE isactive = true
      ORDER BY category, name
    `

    // Group products by category
    const productsByCategory = products.reduce((acc, product) => {
      const category = product.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push({
        ...product,
        price: Number.parseInt(product.price),
        salePrice: product.salePrice ? Number.parseInt(product.salePrice) : null,
      })
      return acc
    }, {})

    return { products, productsByCategory, count: products.length }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { error: "Failed to fetch products" }
  }
}

export default async function ExpressShopPage() {
  const { products, productsByCategory, error, count } = await getProducts()

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Express Shop</h1>
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-red-700">Error Loading Products</h2>
          <p className="text-red-600">{error}</p>
          <div className="mt-4">
            <Link
              href="/api/rebuild-database"
              className="inline-block rounded bg-[#2B7A0B] px-4 py-2 text-white hover:bg-[#236209]"
            >
              Initialize Database
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Express Shop</h1>
        <div className="rounded-lg bg-amber-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-amber-700">No Products Found</h2>
          <p className="text-amber-600">There are no products available in the shop at the moment.</p>
        </div>
      </div>
    )
  }

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  // Calculate discount percentage
  const calculateDiscount = (price, salePrice) => {
    if (!salePrice) return null
    const discount = ((price - salePrice) / price) * 100
    return Math.round(discount)
  }

  // Format category name for display
  const formatCategoryName = (category) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Express Shop</h1>
      <p className="mb-8 text-gray-600">
        Browse our selection of healthy snacks, supplements, and meal prep essentials
      </p>

      <div className="space-y-12">
        {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
          <div key={category}>
            <h2 className="mb-6 text-2xl font-semibold">{formatCategoryName(category)}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryProducts.map((product) => (
                <Link href={`/express-shop/${product.id}`} key={product.id}>
                  <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-200">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      {product.salePrice && (
                        <Badge className="absolute right-2 top-2 bg-red-500">
                          {calculateDiscount(product.price, product.salePrice)}% OFF
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-1 font-medium">{product.name}</h3>
                      <div className="mb-2 line-clamp-2 text-sm text-gray-600">{product.description}</div>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.salePrice ? (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#2B7A0B]">{formatPrice(product.salePrice)}</span>
                              <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-[#2B7A0B]">{formatPrice(product.price)}</span>
                          )}
                        </div>
                        <Badge
                          variant={product.stock > 0 ? "outline" : "secondary"}
                          className={
                            product.stock > 0 ? "border-green-500 text-green-700" : "bg-gray-200 text-gray-700"
                          }
                        >
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
