"use client"

import { useState } from "react"

export function AddToCartButton({ productId }: { productId: number }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const addToCart = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/cart-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Added to cart!")
        setTimeout(() => setMessage(""), 2000)
      } else {
        setMessage(data.error || "Failed to add to cart")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Error adding to cart")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={addToCart}
        disabled={isLoading}
        className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isLoading ? "Adding..." : "Add"}
      </button>

      {message && (
        <div className="absolute right-0 top-full mt-1 w-32 rounded bg-gray-800 p-1 text-center text-xs text-white">
          {message}
        </div>
      )}
    </div>
  )
}
