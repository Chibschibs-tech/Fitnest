"use client"

import { Suspense } from "react"
import { OrderProcess } from "./order-process"
import { LoadingSpinner } from "@/components/loading-spinner"

function OrderPageContent() {
  return <OrderProcess />
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <OrderPageContent />
    </Suspense>
  )
}
