import { Suspense } from "react"
import SubscriptionsContent from "./subscriptions-content"

export default function SubscriptionsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
        <p className="text-gray-600">Manage recurring meal plan subscriptions</p>
      </div>

      <Suspense fallback={<div>Loading subscriptions...</div>}>
        <SubscriptionsContent />
      </Suspense>
    </div>
  )
}
