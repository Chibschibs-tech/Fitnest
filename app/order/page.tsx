import { OrderProcess } from "./order-process"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <OrderProcess />
    </Suspense>
  )
}
