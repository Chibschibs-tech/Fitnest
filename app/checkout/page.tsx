import { ProtectedRoute } from "@/components/auth-guard"
import { CheckoutContent } from "./checkout-content"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = "force-dynamic"

export default function CheckoutPage() {
  // Keep the ProtectedRoute wrapper for the checkout page
  // Users must be authenticated to complete their order
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  )
}
