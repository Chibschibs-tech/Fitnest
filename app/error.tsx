"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  // Check if the error is a response object (which can happen with NextAuth)
  const isResponseError = error && typeof error === "object" && "props" in error

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">
        We apologize for the inconvenience. Please try again or contact support if the problem persists.
      </p>
      {isResponseError ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/login">
            <Button className="bg-green-600 hover:bg-green-700">Return to login</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Return to home</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={reset} className="bg-green-600 hover:bg-green-700">
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline">Return to home</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
