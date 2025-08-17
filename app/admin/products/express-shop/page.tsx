import { Suspense } from "react"
import ExpressShopContent from "./express-shop-content"

export default function ExpressShopPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Express Shop Management</h1>
        <p className="text-gray-600">Manage featured products and express shop availability</p>
      </div>

      <Suspense fallback={<div>Loading express shop...</div>}>
        <ExpressShopContent />
      </Suspense>
    </div>
  )
}
