import type { Metadata } from "next"
import { UnifiedCheckoutContent } from "./unified-checkout-content"

export const metadata: Metadata = {
  title: "Checkout | Fitnest.ma",
  description: "Complete your order with our secure checkout process.",
}

export default function UnifiedCheckoutPage() {
  return <UnifiedCheckoutContent />
}
