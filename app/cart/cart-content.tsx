"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Loader2, Trash2, ShoppingCart, Plus, Minus, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CartItem {
  id: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    salePrice?: number
    imageUrl?: string
  }
}

export function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingItemId, setProcessingItemId] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/cart-direct")

      if (!response.ok) {
        throw new Error(`Failed to fetch cart items: ${response.status}`)
      }

      const data = await response.json()
      setCartItems(data.items || [])
    } catch (error) {
      console.error("Error fetching cart:", error)
      setError(error instanceof Error ? error.message : "Failed to load cart items")
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setProcessingItemId(itemId)

      const response = await fetch("/api/cart-direct", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, quantity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update cart")
      }

      // Update local state
      if (quantity <= 0) {
        setCartItems(cartItems.filter((item) => item.id !== itemId))
      } else {
        setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
      }

      // Dispatch event to update cart count
      window.dispatchEvent(new CustomEvent("cart:updated"))

      toast({
        title: "Cart updated",
        description: "Your cart has been updated",
      })
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update cart",
      })
    } finally {
      setProcessingItemId(null)
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      setProcessingItemId(itemId)

      const response = await fetch(`/api/cart-direct?id=${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to remove item")
      }

      // Update local state
      setCartItems(cartItems.filter((item) => item.id !== itemId))

      // Dispatch event to update cart count
      window.dispatchEvent(new CustomEvent("cart:updated"))

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove item",
      })
    } finally {
      setProcessingItemId(null)
    }
  }

  const clearCart = async () => {
    try {
      setIsProcessing(true)

      const response = await fetch("/api/cart-direct?clearAll=true", {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to clear cart")
      }

      // Update local state
      setCartItems([])

      // Dispatch event to update cart count
      window.dispatchEvent(new CustomEvent("cart:updated"))

      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clear cart",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price
      return total + price * item.quantity
    }, 0)
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingCart className="mb-4 h-16 w-16 text-gray-400" />
        <h2 className="mb-2 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mb-6 text-gray-500">Looks like you haven't added any items to your cart yet.</p>
        <Link href="/express-shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Button variant="outline" onClick={clearCart} disabled={isProcessing} className="flex items-center">
          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items ({cartItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md bg-gray-100">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingCart className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.product.salePrice ? (
                        <>
                          <span className="font-medium text-green-600">{item.product.salePrice} MAD</span>
                          <span className="ml-2 text-gray-500 line-through">{item.product.price} MAD</span>
                        </>
                      ) : (
                        <span>{item.product.price} MAD</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={processingItemId === item.id}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={processingItemId === item.id}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                    onClick={() => removeItem(item.id)}
                    disabled={processingItemId === item.id}
                  >
                    {processingItemId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
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
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{calculateSubtotal().toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{calculateSubtotal().toFixed(2)} MAD</span>
                </div>
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
