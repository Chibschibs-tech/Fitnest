import { Suspense } from "react"
import MealPlansContent from "./meal-plans-content"

export default function MealPlansPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meal Plans Management</h1>
        <p className="text-gray-600">Manage subscription-based meal plans and pricing</p>
      </div>

      <Suspense fallback={<div>Loading meal plans...</div>}>
        <MealPlansContent />
      </Suspense>
    </div>
  )
}
