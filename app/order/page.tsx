import { Suspense } from "react"
import { OrderProcess } from "./order-process"
import { Skeleton } from "@/components/ui/skeleton"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = "force-dynamic"

function OrderLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function OrderPage() {
  return (
    // FIX: Wrap the client component using useSearchParams in a Suspense boundary
    // This prevents rendering errors and provides a loading state.
    <Suspense fallback={<OrderLoading />}>
      <OrderProcess />
    </Suspense>
  )
}
