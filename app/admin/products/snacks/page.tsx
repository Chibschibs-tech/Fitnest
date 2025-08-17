import { Suspense } from "react"
import SnacksContent from "./snacks-content"

export default function SnacksPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Snacks & Supplements Management</h1>
        <p className="text-gray-600">Manage protein bars, supplements, and healthy snacks</p>
      </div>

      <Suspense fallback={<div>Loading snacks...</div>}>
        <SnacksContent />
      </Suspense>
    </div>
  )
}
