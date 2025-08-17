import { Suspense } from "react"
import OrdersContent from "./orders-content"

export default function OrdersPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">General Orders</h1>
        <p className="text-gray-600">Manage one-time orders and express shop purchases</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <OrdersContent />
      </Suspense>
    </div>
  )
}
