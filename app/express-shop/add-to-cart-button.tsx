"use client"

import { useState } from "react"
import { ShoppingCart, Check, AlertCircle } from "lucide-react"

interface AddToCartButtonProps {
  productId: number
  initialQuantity?: number
}

export function AddToCartButton({ productId, initialQuantity = 1 }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(initialQuantity)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const addToCart = async () => {
    setIsLoading(true)
    setStatus("idle")
    setMessage("")

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

      if (response.ok && data.success) {
        setStatus("success")
        setMessage("Added to cart!")

        // Reset status after 3 seconds
        setTimeout(() => {
          setStatus("idle")
          setMessage("")
        }, 3000)

        // Refresh cart count by triggering a custom event
        window.dispatchEvent(new CustomEvent("cart:updated"))
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to add to cart")

        // If not authenticated, redirect to login
        if (response.status === 401) {
          setTimeout(() => {
            window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname)
          }, 1500)
        }
      }
    } catch (error) {
      setStatus("error")
      setMessage("Error adding to cart. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex items-center rounded-l border border-gray-300">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={addToCart}
          disabled={isLoading}
          className="flex items-center space-x-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-green-400"
        >
          {isLoading ? (
            "Adding..."
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {status === "success" && (
        <div className="flex items-center space-x-1 text-sm text-green-600">
          <Check className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center space-x-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}
    </div>
  )
}
