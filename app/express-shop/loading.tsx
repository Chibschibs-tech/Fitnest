import { Skeleton } from "@/components/ui/skeleton"

export default function ExpressShopLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto h-10 w-64" />
        <Skeleton className="mx-auto mt-2 h-6 w-96" />
      </div>

      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
