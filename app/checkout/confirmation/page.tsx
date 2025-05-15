"use client"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ConfirmationContent } from "./confirmation-content"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = "force-dynamic"

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationLoading />}>
      <ConfirmationContent />
    </Suspense>
  )
}

function ConfirmationLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  )
}
