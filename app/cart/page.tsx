import Link from "next/link"
import Image from "next/image"
import { getCartItems, getAuthenticatedUserId } from "@/lib/db-utils"
import { CartActions } from "./cart-actions"

export const dynamic = "force-dynamic"

export default async function CartPage() {
  try {
    // Get authenticated user ID
    const userId = await getAuthenticatedUserId()

    // Get cart items
    const cartItems = await getCartItems(userId)

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.product?.salePrice || item.product?.price || 0
      return sum + price * item.quantity
    }, 0)

    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center shadow">
            <p className="mb-4 text-lg text-gray-600">Your cart is empty</p>
            <Link href="/express-shop" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-white shadow">
                <div className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Cart Items</h2>

                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                            {item.product?.imageUrl ? (
                              <Image
                                src={item.product.imageUrl || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <span className="text-xs text-gray-400">No image</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-grow">
                            <h3 className="font-medium">{item.product?.name}</h3>
                            <p className="text-sm text-gray-600">{item.product?.description}</p>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="font-medium">{item.product?.salePrice || item.product?.price} MAD</span>
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>

                            <CartActions itemId={item.id} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-lg border bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="mb-6 border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{subtotal} MAD</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    className="block w-full rounded bg-green-600 px-4 py-2 text-center text-white hover:bg-green-700"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/express-shop"
                    className="block w-full rounded border border-gray-300 px-4 py-2 text-center hover:bg-gray-50"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    // If not authenticated, redirect to login
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border bg-white p-8 text-center shadow">
          <h1 className="mb-4 text-2xl font-bold">Please Log In</h1>
          <p className="mb-6 text-gray-600">You need to be logged in to view your cart.</p>
          <Link
            href={`/login?redirect=${encodeURIComponent("/cart")}`}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Log In
          </Link>
        </div>
      </div>
    )
  }
}
