import { cookies } from "next/headers"
import { getServerSession } from "next-auth"
import { neon } from "@neondatabase/serverless"
import CartActions from "./cart-actions"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

async function getCartItems() {
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get("cartId")?.value

    if (!cartId) {
      return { items: [] }
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if cart table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'cart'
      ) as exists
    `

    if (!tableExists[0].exists) {
      return { items: [] }
    }

    // Get cart items with product details
    const cartItems = await sql`
      SELECT c.*, p.name, p.price, p.image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.id = ${cartId}
    `

    // Format the response
    const items = cartItems.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      product: {
        id: item.product_id,
        name: item.name,
        price: Number.parseFloat(item.price),
        image: item.image,
      },
    }))

    return { items }
  } catch (error) {
    console.error("Error fetching cart:", error)
    return { items: [], error: String(error) }
  }
}

export default async function CartPage() {
  const session = await getServerSession()
  const { items, error } = await getCartItems()

  // No need to redirect to login if the user is not authenticated
  // We'll handle guest checkout

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <ShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/express-shop">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center space-x-4">
                  <div className="relative h-24 w-24 rounded overflow-hidden bg-gray-100">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      sizes="96px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/express-shop/${item.product_id}`} className="font-medium hover:underline">
                      {item.product.name}
                    </Link>
                    <p className="text-gray-500">${item.product.price.toFixed(2)}</p>
                  </div>
                  <CartActions item={item} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout" className="w-full">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
