import { Suspense } from "react"
import ProductDetailWrapper from "./product-detail-wrapper"

// Loading component
function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse bg-gray-200 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-80 animate-pulse bg-gray-200 rounded"></div>
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse bg-gray-200 rounded"></div>
          <div className="h-6 w-1/4 animate-pulse bg-gray-200 rounded"></div>
          <div className="h-24 animate-pulse bg-gray-200 rounded"></div>
          <div className="h-10 w-1/3 animate-pulse bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Product Details | Fitnest.ma`,
    description: "View product details and add to your cart.",
  }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<ProductDetailLoading />}>
      <ProductDetailWrapper id={params.id} />
    </Suspense>
  )
}
