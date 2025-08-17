import { Suspense } from "react"
import OrdersContent from "./orders-content"

export default function OrdersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600">Manage all customer orders and transactions</p>
      </div>

      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersContent />
      </Suspense>
    </div>
  )
}
