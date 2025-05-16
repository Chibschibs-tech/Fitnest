import { notFound } from "next/navigation"
import { ProductDetailContent } from "./product-detail-content"

// Force dynamic rendering to avoid prerendering issues with useSession
export const dynamic = "force-dynamic"

export default async function ProductDetail({ params }: { params: { id: string } }) {
  try {
    // Fetch product data on the server
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/products/${params.id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      notFound()
    }

    const product = await response.json()

    return <ProductDetailContent product={product} />
  } catch (error) {
    console.error("Error fetching product:", error)
    notFound()
  }
}
