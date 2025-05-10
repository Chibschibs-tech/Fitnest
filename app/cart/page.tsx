import { Suspense } from "react"
import CartWrapper from "./cart-wrapper"

// Loading component
function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Your Cart</h1>
        <p className="mx-auto max-w-2xl text-gray-600">Review the items in your cart before checkout.</p>
      </div>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading cart...</p>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Your Cart | Fitnest.ma",
  description: "Review the items in your cart before checkout.",
}

// Prevent static generation for this page
export const dynamic = "force-dynamic"

export default function CartPage() {
  return (
    <Suspense fallback={<CartLoading />}>
      <CartWrapper />
    </Suspense>
  )
}
