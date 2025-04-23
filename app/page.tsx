import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to NextAuth Example</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        This is a complete example of authentication with NextAuth.js in a Next.js application.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
          Sign In
        </Link>
        <Link href="/register" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium">
          Register
        </Link>
      </div>
    </div>
  )
}
