import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import type { Product } from "@/lib/api/home"

interface ExpressShopSectionProps {
  products: Product[]
}

export function ExpressShopSection({ products }: ExpressShopSectionProps) {
  if (products.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <p className="text-gray-500 mb-6">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
            Express Shop
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Discover our selection of healthy snacks and supplements to complement your meal plans and keep you energized throughout the day.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => {
            const displayPrice = product.price?.discount > 0 && product.price?.base > product.price?.discount
              ? product.price.discount
              : product.price?.base || 0
            const hasDiscount = product.price?.discount > 0 && product.price?.base > product.price?.discount

            return (
              <article 
                key={product.id} 
                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={product.image || "/placeholder.svg?height=192&width=256"} 
                    alt={`${product.name} - ${product.description}`} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {hasDiscount && (
                    <div className="absolute top-3 right-3 bg-fitnest-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Sale
                    </div>
                  )}
                  {product.stock_quantity <= 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-fitnest-green transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-baseline gap-2">
                      {hasDiscount ? (
                        <>
                          <span className="text-2xl font-bold text-fitnest-green">{displayPrice} MAD</span>
                          <span className="text-sm text-gray-500 line-through">{product.price.base} MAD</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-fitnest-green">{displayPrice} MAD</span>
                      )}
                    </div>
                    <Link href={`/express-shop/${product.id}`} className="w-full">
                      <Button 
                        size="sm" 
                        className="w-full bg-fitnest-green hover:bg-fitnest-green/90 text-white transition-all hover:shadow-lg"
                        aria-label={`Shop ${product.name}`}
                        disabled={product.stock_quantity <= 0}
                      >
                        {product.stock_quantity > 0 ? 'Shop Now' : 'Out of Stock'}
                        {product.stock_quantity > 0 && <ChevronRight className="ml-1 h-4 w-4" />}
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link href="/express-shop">
            <Button 
              size="lg"
              className="bg-fitnest-orange text-white hover:bg-fitnest-orange/90 hover:scale-105 transition-all shadow-lg hover:shadow-xl px-8 py-6"
              aria-label="Visit Express Shop for more products"
            >
              Visit Express Shop
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
