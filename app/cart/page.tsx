import Link from "next/link"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

async function getCartItems(userId: string) {
  const sql = neon(process.env.DATABASE_URL!)

  // Ensure cart table exists
  await sql`
    CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Get cart items with product details
  const cartItems = await sql`
    SELECT 
      ci.id,
      ci.product_id as "productId",
      ci.quantity,
      p.name,
      p.description,
      p.price,
      p.saleprice as "salePrice",
      p.imageurl as "imageUrl"
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ${userId}
  `

  return cartItems
}

export default async function CartPage() {
  const session = await getServerSession(authOptions)

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect("/login?redirect=/cart")
  }

  const cartItems = await getCartItems(session.user.id as string)

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum: number, item: any) => {
    const price = item.salePrice || item.price
    return sum + price * item.quantity
  }, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="text-lg text-gray-600">Your cart is empty.</p>
          <Link
            href="/express-shop"
            className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Cart Items</h2>
              <div className="divide-y">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex py-4">
                    <div className="h-24 w-24 flex-shrink-0">
                      <img
                        src={item.imageUrl || "/placeholder.svg?height=96&width=96&query=food"}
                        alt={item.name}
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <p className="text-lg font-medium">
                          ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <div className="mt-auto flex justify-between">
                        <p className="text-sm">${(item.salePrice || item.price).toFixed(2)} each</p>
                        <form action="/api/cart/remove" method="post">
                          <input type="hidden" name="itemId" value={item.id} />
                          <button type="submit" className="text-sm text-red-600 hover:text-red-800">
                            Remove
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <div className="mb-4 flex justify-between">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className="mb-4 flex justify-between">
              <p>Shipping</p>
              <p>Calculated at checkout</p>
            </div>
            <div className="mb-4 border-t pt-4">
              <div className="flex justify-between">
                <p className="text-lg font-medium">Total</p>
                <p className="text-lg font-medium">${subtotal.toFixed(2)}</p>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full rounded-md bg-green-600 px-4 py-3 text-center text-white hover:bg-green-700"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/express-shop"
              className="mt-4 block w-full rounded-md border border-gray-300 px-4 py-3 text-center hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
