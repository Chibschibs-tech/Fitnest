import type { Metadata } from "next"
import { CartWrapper } from "./cart-wrapper"

export const metadata: Metadata = {
  title: "Shopping Cart | Fitnest.ma",
  description: "Review and manage items in your shopping cart.",
}

// Prevent static generation for this page
export const dynamic = "force-dynamic"

export default function CartPage() {
  return <CartWrapper />
}
