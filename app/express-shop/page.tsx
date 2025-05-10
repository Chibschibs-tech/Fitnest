import type { Metadata } from "next"
import { Suspense } from "react"
import ExpressShopWrapper from "./express-shop-wrapper"

// Loading component
function ExpressShopLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Express Shop</h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          Browse our selection of healthy snacks, protein bars, and more for quick delivery.
        </p>
      </div>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading products...</p>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: "Express Shop | Fitnest.ma",
  description: "Browse our selection of healthy snacks, protein bars, and more for quick delivery.",
}

export default function ExpressShopPage() {
  return (
    <Suspense fallback={<ExpressShopLoading />}>
      <ExpressShopWrapper />
    </Suspense>
  )
}
