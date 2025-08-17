import { Suspense } from "react"
import SubscriptionsContent from "./subscriptions-content"

export default function SubscriptionsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-gray-600">Manage recurring meal plan subscriptions</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SubscriptionsContent />
      </Suspense>
    </div>
  )
}
