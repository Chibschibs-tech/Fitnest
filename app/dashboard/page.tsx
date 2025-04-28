import { ProtectedRoute } from "@/components/auth-guard"
import { DashboardContent } from "./dashboard-content"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = "force-dynamic"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
