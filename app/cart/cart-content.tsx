"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function CartContent() {
  const router = useRouter()
  const { items, subtotal, isLoading, updateQuantity, removeItem } = useCart()
  const [processingItemId, setProcessingItemId] = useState<number | null>(null)

  const handleQuantityChange = async (itemId: number, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(1, currentQuantity + change)
    setProcessingItemId(itemId)
    try {
      await updateQuantity(itemId, newQuantity)
    } finally {
      setProcessingItemId(null)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    setProcessingItemId(itemId)
    try {
      await removeItem(itemId)
    } finally {
      setProcessingItemId(null)
    }
  }

  const handleCheckout = () => {
    router.push("/unified-checkout")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
        <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border border-dashed p-12 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300" />
          <div>
            <h2 className="text-xl font-medium">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Looks like you haven't added any items to your cart yet.</p>
          </div>
          <Link href="/express-shop">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.id} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100 sm:h-32 sm:w-32">
                        {item.product.imageUrl ? (
                          <Image
                            src={item.product.imageUrl || "/placeholder.svg"}
                            alt={item.product.name}
                            width={128}
                            height={128}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingCart className="h-10 w-10 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{item.product.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Category: {item.product.category.replace("_", " ")}
                            </p>
                          </div>
                          <div className="text-right">
                            {item.product.salePrice ? (
                              <div>
                                <p className="text-lg font-medium text-green-600">{item.product.salePrice} MAD</p>
                                <p className="text-sm text-gray-500 line-through">{item.product.price} MAD</p>
                              </div>
                            ) : (
                              <p className="text-lg font-medium">{item.product.price} MAD</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex flex-1 items-end justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center rounded-md border">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                disabled={processingItemId === item.id}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-10 text-center text-sm">
                                {processingItemId === item.id ? (
                                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                disabled={processingItemId === item.id}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={processingItemId === item.id}
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{subtotal} MAD</span>
                </div>

                <Button className="mt-6 w-full" size="lg" onClick={handleCheckout}>
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Need help? Contact our support team</p>
                  <p className="mt-1">
                    <Link href="/express-shop" className="text-green-600 hover:underline">
                      Continue Shopping
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
