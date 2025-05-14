"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function MinimalExpressShop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await fetch("/api/products-simple")

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`)
        }

        const data = await response.json()
        console.log("Products loaded:", data.length)
        setProducts(data)
        setError(null)
      } catch (err) {
        console.error("Error loading products:", err)
        setError(err instanceof Error ? err.message : "Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Express Shop (Minimal)</h1>
        <p className="mx-auto max-w-2xl text-gray-600">A simplified version of the Express Shop for troubleshooting.</p>
      </div>

      {loading ? (
        <div className="text-center">
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 text-lg font-medium text-red-800">Error</h2>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : (
        <div>
          <p className="mb-4">Found {products.length} products</p>
          <ul className="list-disc pl-5">
            {products.map((product: any) => (
              <li key={product.id} className="mb-2">
                {product.name} - {product.price} MAD
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex space-x-4">
        <Link href="/express-shop" className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
          Back to Express Shop
        </Link>
        <Link href="/express-shop/diagnostic" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Run Diagnostics
        </Link>
      </div>
    </div>
  )
}
