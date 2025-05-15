import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getAuthenticatedUserId, getCartItems } from "@/lib/db-utils"
import { CartActions } from "./cart-actions"
import { ShoppingCart } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CartPage() {
  try {
    // Get authenticated user ID
    const userId = await getAuthenticatedUserId()

    // Get cart items
    const cartItems = await getCartItems(userId)

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.product?.salePrice || item.product?.price || 0
      return total + price * item.quantity
    }, 0)

    const shipping = subtotal > 200 ? 0 : 30
    const total = subtotal + shipping

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
        <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-gray-50 p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400" />
            <h2 className="text-xl font-medium">Your cart is empty</h2>
            <p className="text-gray-600">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/express-shop" className="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-gray-200">
                <div className="grid grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-600">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 border-b border-gray-200 p-4 last:border-0">
                    <div className="col-span-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                          {item.product?.imageUrl ? (
                            <Image
                              src={item.product.imageUrl || "/placeholder.svg"}
                              alt={item.product?.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-xs text-gray-400">No image</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            <Link
                              href={`/express-shop/${item.productId}`}
                              className="hover:text-green-600 hover:underline"
                            >
                              {item.product?.name || "Product"}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-600">{item.product?.category || "Category"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      {item.product?.salePrice ? (
                        <div className="text-center">
                          <span className="font-medium text-green-600">{formatPrice(item.product.salePrice)}</span>
                          <span className="block text-xs text-gray-500 line-through">
                            {formatPrice(item.product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">{formatPrice(item.product?.price || 0)}</span>
                      )}
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      <CartActions itemId={item.id} initialQuantity={item.quantity} />
                    </div>
                    <div className="col-span-2 flex items-center justify-end font-medium">
                      {formatPrice((item.product?.salePrice || item.product?.price || 0) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-lg border border-gray-200 p-6">
                <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
                <div className="space-y-3 border-b border-gray-200 pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                  </div>
                </div>
                <div className="flex justify-between py-4">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">{formatPrice(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="mt-4 block w-full rounded bg-green-600 py-3 text-center font-medium text-white hover:bg-green-700"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/express-shop"
                  className="mt-3 block w-full text-center text-sm text-gray-600 hover:text-green-600 hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    // If not authenticated, redirect to login
    redirect("/login?redirect=/cart")
  }
}
