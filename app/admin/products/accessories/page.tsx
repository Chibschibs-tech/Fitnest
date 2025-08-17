import { Suspense } from "react"
import AccessoriesContent from "./accessories-content"

export default function AccessoriesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Accessories Management</h1>
        <p className="text-gray-600">Manage fitness accessories, bags, bottles, and merchandise</p>
      </div>

      <Suspense fallback={<div>Loading accessories...</div>}>
        <AccessoriesContent />
      </Suspense>
    </div>
  )
}
