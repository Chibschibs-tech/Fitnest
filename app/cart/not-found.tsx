import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Cart Not Found</h2>
      <p className="mb-6">The cart you're looking for doesn't exist or has been removed.</p>
      <Link href="/express-shop" className="text-green-600 hover:underline">
        Return to Express Shop
      </Link>
    </div>
  )
}
