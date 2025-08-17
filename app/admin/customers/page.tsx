import { Suspense } from "react"
import CustomersContent from "./customers-content"

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <p className="text-gray-600">View and manage customer accounts and statistics</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CustomersContent />
      </Suspense>
    </div>
  )
}
