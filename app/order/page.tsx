import { ProtectedRoute } from "@/components/auth-guard"
import { OrderContent } from "./order-content"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = "force-dynamic"

export default function OrderPage() {
  return (
    <ProtectedRoute>
      <OrderContent />
    </ProtectedRoute>
  )
}
