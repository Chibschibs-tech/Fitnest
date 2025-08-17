import { Suspense } from "react"
import DeliveriesContent from "./deliveries-content"

export default function DeliveriesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
        <p className="text-gray-600">Plan and manage meal deliveries</p>
      </div>

      <Suspense fallback={<div>Loading deliveries...</div>}>
        <DeliveriesContent />
      </Suspense>
    </div>
  )
}
