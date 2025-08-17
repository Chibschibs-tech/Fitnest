import { Suspense } from "react"
import SubscriptionsContent from "./subscriptions-content"

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={<div>Loading subscriptions...</div>}>
      <SubscriptionsContent />
    </Suspense>
  )
}
