import { Suspense } from "react"
import DeliveriesContent from "./deliveries-content"

export default function DeliveriesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Delivery Management</h1>
        <p className="text-gray-600">Track and manage meal deliveries</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <DeliveriesContent />
      </Suspense>
    </div>
  )
}
