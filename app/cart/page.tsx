import type { Metadata } from "next"
import { CartContent } from "./cart-content"

export const metadata: Metadata = {
  title: "Shopping Cart | Fitnest.ma",
  description: "Review and manage items in your shopping cart.",
}

export default function CartPage() {
  return <CartContent />
}
