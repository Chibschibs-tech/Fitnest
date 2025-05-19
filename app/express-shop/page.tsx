import Link from "next/link"
import { AlertCircle } from "lucide-react"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default async function ExpressShop() {
  // Redirect to the fixed version
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 rounded-md border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center">
          <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />
          <h2 className="font-medium text-amber-800">Express Shop Maintenance</h2>
        </div>
        <p className="mt-2 text-amber-700">
          The Express Shop is currently being updated. Please use one of the alternative versions below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/express-shop/fixed"
          className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <h2 className="mb-2 text-xl font-medium">Fixed Version</h2>
          <p className="mb-4 text-center text-gray-600">
            This version uses a direct SQL approach that works with your database schema.
          </p>
          <span className="rounded-full bg-green-600 px-4 py-1 text-sm font-medium text-white">Recommended</span>
        </Link>

        <Link
          href="/express-shop/minimal"
          className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <h2 className="mb-2 text-xl font-medium">Minimal Version</h2>
          <p className="mb-4 text-center text-gray-600">A simplified version with minimal dependencies and styling.</p>
          <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">Alternative</span>
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-medium">Diagnostic Tools</h3>
        <div className="flex flex-wrap gap-4">
          <Link href="/api/schema-check" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Check Database Schema
          </Link>
          <Link href="/api/products-simple" className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            Refresh Products
          </Link>
        </div>
      </div>
    </div>
  )
}
