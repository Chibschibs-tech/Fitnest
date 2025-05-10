import type { Metadata } from "next"
import { ProductDetailContent } from "./product-detail-content"
import { db, products } from "@/lib/db"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const id = Number.parseInt(params.id)

  try {
    const product = await db.select().from(products).where(eq(products.id, id)).limit(1)

    if (!product.length) {
      return {
        title: "Product Not Found | Fitnest.ma",
      }
    }

    return {
      title: `${product[0].name} | Fitnest.ma Express Shop`,
      description: product[0].description,
    }
  } catch (error) {
    return {
      title: "Product | Fitnest.ma Express Shop",
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = Number.parseInt(params.id)

  try {
    const product = await db.select().from(products).where(eq(products.id, id)).limit(1)

    if (!product.length) {
      notFound()
    }

    // Get related products from the same category
    const relatedProducts = await db
      .select()
      .from(products)
      .where(eq(products.category, product[0].category))
      .where(eq(products.isActive, true))
      .limit(4)

    return <ProductDetailContent product={product[0]} relatedProducts={relatedProducts} />
  } catch (error) {
    console.error("Error fetching product:", error)
    notFound()
  }
}
