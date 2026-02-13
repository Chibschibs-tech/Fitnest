import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sparkles, Tag, ShoppingBag } from "lucide-react"
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-fitnest-green/10 rounded-full px-4 py-2 mb-4">
            <ShoppingBag className="h-4 w-4 text-fitnest-green" />
            <span className="text-sm font-semibold text-fitnest-green">Express Shop</span>
          </div>
          <h2 className="mb-4 text-3xl md:text-5xl font-bold text-gray-900">
            Snacks & compléments <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">premium</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Des encas sains et des compléments de qualité pour accompagner vos plans de repas et booster votre progression.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {products.map((product) => {
            const displayPrice = product.price?.discount > 0 && product.price?.base > product.price?.discount
              ? product.price.discount
              : product.price?.base || 0
            const hasDiscount = product.price?.discount > 0 && product.price?.base > product.price?.discount
            const isOutOfStock = product.stock_quantity <= 0

            return (
              <article 
                key={product.id} 
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-gray-50">
                  <Image 
                    src={product.images[0] || "/placeholder.svg?height=224&width=320"} 
                    alt={`${product.name}`} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                    {isOutOfStock && (
                      <div className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        <span>Out of Stock</span>
                      </div>
                    )}
                    {hasDiscount && !isOutOfStock && (
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-fitnest-orange to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        <Tag className="h-3.5 w-3.5" />
                        <span>Sale</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-fitnest-green transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  
                  {/* Pricing */}
                  <div className="mb-5 p-4 bg-gradient-to-br from-fitnest-green/5 to-fitnest-orange/5 rounded-2xl border border-fitnest-green/10">
                    <div className="flex items-baseline justify-center gap-2">
                      {hasDiscount ? (
                        <>
                          <span className="text-3xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                            {displayPrice}
                          </span>
                          <span className="text-sm text-gray-600 font-medium">MAD</span>
                          <span className="text-sm text-gray-500 line-through ml-2">{product.price.base}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                            {displayPrice}
                          </span>
                          <span className="text-sm text-gray-600 font-medium">MAD</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href={`/express-shop/${product.id}`} className="block">
                    <Button 
                      size="lg"
                      className={`w-full ${
                        isOutOfStock 
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white transition-all hover:shadow-lg'
                      } font-semibold rounded-xl group/btn`}
                      aria-label={`Shop ${product.name}`}
                      disabled={isOutOfStock}
                    >
                      {isOutOfStock ? (
                        <span>Out of Stock</span>
                      ) : (
                        <>
                          <span>Ajouter au Panier</span>
                          <ChevronRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link href="/express-shop">
            <Button
              size="lg"
              variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-fitnest-orange hover:text-fitnest-orange transition-all shadow-md hover:shadow-lg px-8 py-6 rounded-xl font-semibold group/cta"
              aria-label="Visit Express Shop for more products"
            >
              <span>Découvrir tous les Produits</span>
              <ChevronRight className="ml-2 h-5 w-5 group-hover/cta:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
