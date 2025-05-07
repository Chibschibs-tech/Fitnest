import { ApiTest } from "@/components/api-test"

export default function TestApiPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">API Connection Test</h1>
      <ApiTest />
    </div>
  )
}
