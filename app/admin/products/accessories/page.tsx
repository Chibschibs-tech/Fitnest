import { Suspense } from "react"
import AccessoriesContent from "./accessories-content"

export default function AccessoriesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Accessories</h1>
        <p className="text-gray-600">Manage fitness accessories, bags, bottles, and apparel</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <AccessoriesContent />
      </Suspense>
    </div>
  )
}
