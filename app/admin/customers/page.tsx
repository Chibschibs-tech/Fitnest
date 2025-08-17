import { Suspense } from "react"
import CustomersContent from "./customers-content"

export default function CustomersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600">Manage your customers and view their order history</p>
      </div>

      <Suspense fallback={<div>Loading customers...</div>}>
        <CustomersContent />
      </Suspense>
    </div>
  )
}
