import { Suspense } from "react"
import ExpressShopContent from "./express-shop-content"

export default function ExpressShopPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Express Shop Management</h1>
        <p className="text-gray-600">Manage featured products and express shop inventory</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ExpressShopContent />
      </Suspense>
    </div>
  )
}
