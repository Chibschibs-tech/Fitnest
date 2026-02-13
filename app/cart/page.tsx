/**
 * Cart Page
 * Displays cart items with quantity controls, subtotal, and checkout CTA.
 */

"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Plus, Minus, Trash2, ChevronRight } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-fitnest-green/10 to-fitnest-orange/10 shadow-lg">
              <ShoppingCart className="h-12 w-12 text-fitnest-green" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Votre panier est vide
              </h2>
              <p className="text-gray-600 max-w-md">
                Ajoutez des produits depuis l&apos;Express Shop pour les voir ici.
              </p>
            </div>
            <Link href="/express-shop">
              <Button className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <span>Continuer vos achats</span>
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getSubtotal()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panier</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <Card
              key={item.productId}
              className="overflow-hidden rounded-xl border border-gray-100 shadow-sm"
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingCart className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/express-shop/${item.productId}`}
                      className="font-semibold text-gray-900 hover:text-fitnest-green transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-lg font-bold text-fitnest-green mt-1">
                      {item.price} MAD
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(item.productId)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900">
                      {item.price * item.quantity} MAD
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-xl border border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-gray-700">Sous-total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                {subtotal} MAD
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/express-shop" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-200 hover:border-fitnest-green hover:text-fitnest-green font-semibold rounded-xl"
                >
                  Continuer vos achats
                </Button>
              </Link>
              <Link href="/cart/checkout" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold rounded-xl shadow-lg group">
                  <span>Continuer vers le paiement</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
