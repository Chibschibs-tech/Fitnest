"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import Image from "next/image"
import { Loader2, Trash2, Plus, Minus } from "lucide-react"

export function CartIcon() {
  const { items, itemCount, subtotal, isLoading, removeItem, updateQuantity } = useCart()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleQuantityChange = async (itemId: number, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(1, currentQuantity + change)
    await updateQuantity(itemId, newQuantity)
  }

  const handleCheckout = () => {
    setOpen(false)
    router.push("/cart")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : itemCount === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center space-y-4 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300" />
            <div>
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-500">Add items to get started</p>
            </div>
            <SheetClose asChild>
              <Button onClick={() => router.push("/express-shop")}>Browse Products</Button>
            </SheetClose>
          </div>
        ) : (
          <div className="mt-6 flex flex-col space-y-4">
            <div className="flex-1 overflow-y-auto pr-2">
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        {item.product.imageUrl ? (
                          <Image
                            src={item.product.imageUrl || "/placeholder.svg"}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <ShoppingCart className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.product.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">
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
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {itemCount > 0 && (
          <SheetFooter className="mt-6 border-t pt-4">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-base font-medium">
                <span>Subtotal</span>
                <span>{subtotal} MAD</span>
              </div>
              <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout</p>
              <SheetClose asChild>
                <Button className="w-full" onClick={handleCheckout}>
                  Checkout
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" className="w-full" onClick={() => router.push("/express-shop")}>
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
