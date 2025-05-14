import { Suspense } from "react"
import { SimpleExpressShop } from "./simple-express-shop"
import { ErrorBoundary } from "react-error-boundary"

export const dynamic = "force-dynamic"

export default function ExpressShop() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<LoadingFallback />}>
        <SimpleExpressShop />
      </Suspense>
    </ErrorBoundary>
  )
}

function ErrorFallback() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <h2 className="mb-2 text-lg font-medium text-red-800">Something went wrong</h2>
        <p className="text-sm text-red-700">
          We encountered an error while loading the Express Shop. Please try again later or contact support.
        </p>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
        <p>Loading Express Shop...</p>
      </div>
    </div>
  )
}
