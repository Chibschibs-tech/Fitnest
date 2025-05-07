"use client"

import type React from "react"

import { useState } from "react"
import { siteConfig } from "@/lib/constants"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setError("")

    try {
      const response = await fetch(`${siteConfig.apiUrl}/api/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to subscribe")
      }

      setStatus("success")
      setEmail("")
    } catch (error) {
      setStatus("error")
      setError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>
      {status === "error" && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {status === "success" && <div className="text-green-500 text-sm mt-2">Thank you for subscribing!</div>}
    </form>
  )
}
