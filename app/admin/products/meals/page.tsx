import { Suspense } from "react"
import MealsContent from "./meals-content"

export default function MealsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Individual Meals</h1>
        <p className="text-gray-600">Manage standalone meals available for purchase</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <MealsContent />
      </Suspense>
    </div>
  )
}
