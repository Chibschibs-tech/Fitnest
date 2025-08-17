import { Suspense } from "react"
import MealsContent from "./meals-content"

export default function MealsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Individual Meals Management</h1>
        <p className="text-gray-600">Manage standalone meal products and their availability</p>
      </div>

      <Suspense fallback={<div>Loading meals...</div>}>
        <MealsContent />
      </Suspense>
    </div>
  )
}
