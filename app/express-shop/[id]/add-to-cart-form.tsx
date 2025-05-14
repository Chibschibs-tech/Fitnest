"use client"

import type React from "react"

import { useState } from "react"

export function AddToCartForm({ productId }: { productId: number }) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  const addToCart = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      })

      const data = await response.json()

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
      setError("Error adding to cart. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={addToCart} className="space-y-4">
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="mt-1 flex max-w-xs items-center">
          <button
            type="button"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="rounded-l border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200"
          >
            -
          </button>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 border-y border-gray-300 px-3 py-2 text-center"
          />
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="rounded-r border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-green-600 px-4 py-3 text-white hover:bg-green-700 disabled:bg-green-400"
      >
        {isLoading ? "Adding to Cart..." : "Add to Cart"}
      </button>

      {message && <div className="mt-2 rounded bg-green-100 p-2 text-center text-green-700">{message}</div>}

      {error && <div className="mt-2 rounded bg-red-100 p-2 text-center text-red-700">{error}</div>}
    </form>
  )
}
