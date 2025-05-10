"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Loader2, ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function CartContent() {
  const { items, subtotal, itemCount, isLoading, updateQuantity, removeItem } = useCart()
  const router = useRouter()

  const handleQuantityChange = async (itemId: number, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(1, currentQuantity + change)
    await updateQuantity(itemId, newQuantity)
  }

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">Loading your cart...</span>
      </div>
    )
  }

  if (itemCount === 0) {
    return (
      <div className="flex h-60 flex-col items-center justify-center space-y-4 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-300" />
        <div>
          <p className="text-xl font-medium">Your cart is empty</p>
          <p className="text-gray-500">Add items to get started</p>
        </div>
        <Button onClick={() => router.push("/express-shop")}>Browse Products</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Cart Items ({itemCount})</h2>
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl || "/placeholder.svg"}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{item.product.name}</h3>
                      <p className="mt-1 text-gray-500">
                        {item.product.salePrice ? (
                          <>
                            <span className="text-green-600">{item.product.salePrice} MAD</span>{" "}
                            <span className="text-xs line-through">{item.product.price} MAD</span>
                          </>
                        ) : (
                          <span>{item.product.price} MAD</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center rounded-md border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal} MAD</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{subtotal} MAD</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => router.push("/checkout")}>
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/express-shop")}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
