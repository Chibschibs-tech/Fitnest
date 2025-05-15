"use client"

import { useState } from "react"

export function AddToCartButton({ productId }: { productId: number }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const addToCart = async () => {
    setIsLoading(true)
    setMessage("")
    setError("")

    try {
      console.log("Adding to cart:", productId)
      const response = await fetch("/api/cart-direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok) {
        setMessage("Added to cart!")
        setTimeout(() => setMessage(""), 2000)
      } else {
        setError(data.error || "Failed to add to cart")

        // If not authenticated, redirect to login
        if (response.status === 401) {
          setTimeout(() => {
            window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname)
          }, 1500)
        }
      }
    } catch (error) {
      console.error("Error in add to cart:", error)
      setError("Error adding to cart. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={addToCart}
        disabled={isLoading}
        className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:bg-green-400"
      >
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>

      {message && (
        <div className="absolute right-0 top-full mt-1 w-32 rounded bg-green-600 p-1 text-center text-xs text-white">
          {message}
        </div>
      )}

      {error && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded bg-red-600 p-1 text-center text-xs text-white">
          {error}
        </div>
      )}
    </div>
  )
}
