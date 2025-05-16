import { getCartId, getCartItems } from "@/lib/db-utils"
import { CartContent } from "./cart-content"

export const dynamic = "force-dynamic"

export default async function Cart() {
  const cartId = getCartId()
  const cartItems = await getCartItems(cartId)

  // Calculate totals
  let subtotal = 0
  let discount = 0

  for (const item of cartItems) {
    const itemPrice = item.salePrice || item.price
    subtotal += itemPrice * item.quantity

    if (item.salePrice) {
      discount += (item.price - item.salePrice) * item.quantity
    }
  }

  const total = subtotal

  return <CartContent cartItems={cartItems} summary={{ subtotal, discount, total }} />
}
