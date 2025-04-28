import { OrderContent } from "./order-content"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = "force-dynamic"

export default function OrderPage() {
  // Remove the ProtectedRoute wrapper to allow anyone to access this page
  return <OrderContent />
}
