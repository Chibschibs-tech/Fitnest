import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

export default function ProductNotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
      <ShoppingCart className="mb-6 h-16 w-16 text-gray-400" />
      <h1 className="mb-2 text-3xl font-bold">Product Not Found</h1>
      <p className="mb-8 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
      <Button asChild>
        <Link href="/express-shop">Browse Express Shop</Link>
      </Button>
    </div>
  )
}
