/**
 * Product Card
 * Client component for Express Shop product cards with direct add-to-cart button.
 */

"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Tag, ChevronRight } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  description: string
  images: string[]
  category: { name: string }
  price: { base: number; discount: number }
  stock_quantity: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const hasDiscount =
    product.price?.discount > 0 && product.price?.base > product.price?.discount
  const displayPrice = hasDiscount ? product.price.discount : product.price?.base ?? 0
  const isOutOfStock = product.stock_quantity <= 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return

    addItem({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] ?? "",
      price: displayPrice,
      quantity: 1,
    })

    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    })
  }

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-xl border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
      <Link href={`/express-shop/${product.id}`}>
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-gray-300" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            {isOutOfStock && (
              <Badge className="bg-red-500 text-white border-0 font-bold shadow-lg text-xs">
                Out of Stock
              </Badge>
            )}
            {hasDiscount && !isOutOfStock && (
              <Badge className="bg-gradient-to-r from-fitnest-orange to-orange-500 text-white border-0 font-bold shadow-lg flex items-center gap-1 text-xs">
                <Tag className="h-3 w-3" />
                Sale
              </Badge>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/30 to-transparent">
            <h3 className="line-clamp-2 text-lg font-bold text-white">{product.name}</h3>
          </div>
        </div>
      </Link>

      <CardHeader className="flex-shrink-0 p-4 pb-2">
        {product.description && (
          <CardDescription className="line-clamp-2 text-sm text-gray-600">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-shrink-0 px-4 pb-3">
        {!isOutOfStock && product.stock_quantity <= 5 && (
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-fitnest-orange">
            <div className="h-1.5 w-1.5 rounded-full bg-fitnest-orange animate-pulse" />
            Only {product.stock_quantity} left!
          </div>
        )}

        <div className="p-3 bg-gradient-to-br from-fitnest-green/5 to-fitnest-orange/5 rounded-xl border border-fitnest-green/10">
          <div className="flex items-baseline justify-center gap-1.5">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                  {displayPrice}
                </span>
                <span className="text-xs text-gray-600 font-medium">MAD</span>
                <span className="text-xs text-gray-500 line-through ml-1">
                  {product.price.base}
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                  {displayPrice}
                </span>
                <span className="text-xs text-gray-600 font-medium">MAD</span>
              </>
            )}
          </div>
          {hasDiscount && (
            <div className="text-center mt-1">
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-fitnest-orange">
                Save{" "}
                {Math.round(
                  ((product.price.base - product.price.discount) / product.price.base) * 100
                )}
                %
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto p-4 pt-0">
        <Button
          className={`w-full ${
            isOutOfStock
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white"
          } font-bold text-sm py-3 rounded-xl shadow-lg transition-all duration-300 group/btn`}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              <span>Ajouter au Panier</span>
              <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
