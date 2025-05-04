import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BlogPostLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Button>
        </Link>

        <div className="mb-6">
          <Skeleton className="h-8 w-24 rounded-full mb-4" />
          <Skeleton className="h-12 w-full mb-4" />

          <div className="flex items-center mb-6">
            <div className="flex items-center mr-6">
              <Skeleton className="w-10 h-10 rounded-full mr-3" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-20 mr-6" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <Skeleton className="h-80 w-full rounded-lg mb-8" />

        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </div>
    </div>
  )
}
