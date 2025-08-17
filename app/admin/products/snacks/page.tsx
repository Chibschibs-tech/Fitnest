import { Suspense } from "react"
import SnacksContent from "./snacks-content"

export default function SnacksPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Snacks & Supplements</h1>
        <p className="text-gray-600">Manage protein bars, supplements, and healthy snacks</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SnacksContent />
      </Suspense>
    </div>
  )
}
