import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BlogNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-6">Blog Post Not Found</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Sorry, the blog post you're looking for doesn't exist or may have been moved.
      </p>
      <Link href="/blog">
        <Button className="bg-logo-green hover:bg-logo-green/90 text-white">Return to Blog</Button>
      </Link>
    </div>
  )
}
