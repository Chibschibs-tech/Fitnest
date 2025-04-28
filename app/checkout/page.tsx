import { ProtectedRoute } from "@/components/auth-guard"
import { CheckoutContent } from "./checkout-content"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = "force-dynamic"

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  )
}
